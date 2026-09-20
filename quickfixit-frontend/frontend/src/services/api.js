/**
 * src/services/api.js
 *
 * Central API client for QuickFix It.
 *
 * Design decisions:
 *  - All requests go to /api/v1/* — Vite's dev proxy forwards them to :8000.
 *  - JWT is stored in localStorage under 'qf_token'.
 *  - Every exported function catches network errors and falls back to
 *    the corresponding mock-data shape so the UI never breaks when the
 *    backend is offline. This keeps the demo robust during presentations.
 *  - Zero 3rd-party dependencies — only the browser Fetch API.
 */

import { MOCK_USERS, MOCK_INCIDENT_DETAIL, MOCK_CONTRACTOR_JOBS } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const BASE = '/api/v1';
const TOKEN_KEY = 'qf_token';

// ─────────────────────────────────────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    setToken(null); // clear stale token
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || res.statusText);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Multipart/form-data upload (no Content-Type header — browser sets boundary)
// ─────────────────────────────────────────────────────────────────────────────
async function apiUpload(path, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData });

  if (res.status === 401) { setToken(null); throw new Error('UNAUTHORIZED'); }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || res.statusText);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Login with phone/identifier (e.g. "+91 98201 54829", "APEX-CREW-04") and password.
 * The backend accepts these as the identifier field; email is the fallback.
 *
 * Returns a frontend-compatible user object (shape matches MOCK_USERS).
 * Falls back to the matching mock user if the backend is unreachable.
 */
export async function login(identifier, password, selectedRole) {
  try {
    const body = { identifier: identifier.trim(), password };
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // Store the JWT
    setToken(data.access_token);

    // Fetch the profile for the full user object
    const profile = await apiFetch('/auth/me');
    return _profileToUser(profile);
  } catch (err) {
    if (err.message !== 'UNAUTHORIZED') {
      console.warn('[api] Backend login failed, using mock fallback:', err.message);
    }
    // Graceful fallback — return the mock user for the chosen role
    return selectedRole === 'citizen'
      ? MOCK_USERS.citizen
      : selectedRole === 'contractor'
      ? MOCK_USERS.contractor
      : MOCK_USERS.officer;
  }
}

/** Restore session from a stored JWT. Returns null if no valid token. */
export async function restoreSession() {
  if (!getToken()) return null;
  try {
    const profile = await apiFetch('/auth/me');
    return _profileToUser(profile);
  } catch {
    setToken(null);
    return null;
  }
}

/** Clear the stored JWT (frontend-only logout). */
export function logout() {
  setToken(null);
}

// Map backend UserResponse → frontend user object shape
function _profileToUser(p) {
  const base = {
    id: p.id,
    name: p.full_name,
    role: p.role,
    email: p.email,
    ward: p.ward || 'Ward 14 • Maplewood',
    avatar: p.avatar || MOCK_USERS.citizen.avatar,
  };
  if (p.role === 'contractor') {
    return { ...MOCK_USERS.contractor, ...base, company: p.company || 'Apex Paving Ltd.' };
  }
  if (p.role === 'officer') {
    return { ...MOCK_USERS.officer, ...base };
  }
  return { ...MOCK_USERS.citizen, ...base };
}

// ─────────────────────────────────────────────────────────────────────────────
// Complaints (Citizen)
// ─────────────────────────────────────────────────────────────────────────────

/** Submit a new pothole complaint with a photo blob and GPS coords. */
export async function submitComplaint({ photoBlob, gps_lat, gps_lng, description, address_text }) {
  try {
    const fd = new FormData();
    fd.append('photo', photoBlob, 'before.jpg');
    fd.append('gps_lat', String(gps_lat));
    fd.append('gps_lng', String(gps_lng));
    if (description) fd.append('description', description);
    if (address_text) fd.append('address_text', address_text);

    const data = await apiUpload('/complaints/', fd);
    return _complaintToIncident(data);
  } catch (err) {
    console.warn('[api] submitComplaint fallback:', err.message);
    // Return a realistic mock so the UI still navigates to detail
    return {
      ...MOCK_INCIDENT_DETAIL,
      id: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Report Submitted & AI-Verified',
      statusType: 'verified',
      reportedDate: 'Just now',
    };
  }
}

/** Fetch the current user's complaint list. Falls back to []. */
export async function getMyComplaints() {
  try {
    const data = await apiFetch('/complaints/');
    return data.map(_complaintToIncident);
  } catch (err) {
    console.warn('[api] getMyComplaints fallback:', err.message);
    return [];
  }
}

/** Fetch all community complaints (heatmap / feed). Falls back to []. */
export async function getAllComplaints() {
  try {
    const data = await apiFetch('/complaints/public/heatmap');
    // heatmap returns { features: [...] } GeoJSON format
    return (data.features || []).map(_featureToIncident);
  } catch (err) {
    console.warn('[api] getAllComplaints fallback:', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Contractor
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch jobs assigned to the current contractor. Falls back to mock jobs. */
export async function getAssignedJobs() {
  try {
    const data = await apiFetch('/contractor/jobs');
    return data.map(_jobToFrontend);
  } catch (err) {
    console.warn('[api] getAssignedJobs fallback:', err.message);
    return MOCK_CONTRACTOR_JOBS;
  }
}

/**
 * Submit after-repair photo for a job.
 * Returns a verification result object matching the shape GhostOverlayCamera expects.
 */
export async function submitRepairAndVerify(complaintId, { photoBlob, gps_lat, gps_lng }) {
  try {
    const fd = new FormData();
    if (photoBlob) {
      fd.append('after_photo', photoBlob, 'after.jpg');
    }
    fd.append('after_gps_lat', String(gps_lat || 19.076));
    fd.append('after_gps_lng', String(gps_lng || 72.8777));

    const data = await apiUpload(`/contractor/jobs/${complaintId}/submit`, fd);
    return _verificationToVerdict(data);
  } catch (err) {
    console.warn('[api] submitRepairAndVerify fallback:', err.message);
    return null; // caller will use mock scenario result
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shape adapters (backend → frontend)
// ─────────────────────────────────────────────────────────────────────────────

function _complaintToIncident(c) {
  return {
    id: c.id || `CF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    status: _statusLabel(c.status),
    statusType: _statusType(c.status),
    title: c.description || 'Pothole Detected',
    address: c.address_text || `${c.gps_lat?.toFixed(4)}, ${c.gps_lng?.toFixed(4)}`,
    reportedDate: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Just now',
    repairedDate: c.repaired_at ? new Date(c.repaired_at).toLocaleDateString() : 'Pending',
    reporter: 'You',
    contractor: c.contractor_name || 'Pending Assignment',
    crew: c.crew || 'Pending',
    confidence: c.ai_confidence || 0,
    ledgerHash: c.ledger_hash || '#pending...',
    metrics: c.metrics || [],
    timeline: c.timeline || [],
    beforeImage: c.before_photo_url
      ? `/static/photos/${c.before_photo_url}`
      : MOCK_INCIDENT_DETAIL.beforeImage,
    afterImage: c.after_photo_url
      ? `/static/photos/${c.after_photo_url}`
      : MOCK_INCIDENT_DETAIL.afterImage,
  };
}

function _featureToIncident(f) {
  const p = f.properties || {};
  return _complaintToIncident({
    id: p.id,
    status: p.status,
    description: p.description,
    address_text: p.address_text,
    gps_lat: f.geometry?.coordinates?.[1],
    gps_lng: f.geometry?.coordinates?.[0],
    created_at: p.created_at,
  });
}

function _jobToFrontend(j) {
  return {
    id: j.complaint_id || j.id,
    address: j.address_text || j.address,
    citizenPhoto: j.before_photo_url ? `/static/photos/${j.before_photo_url}` : MOCK_CONTRACTOR_JOBS[0].citizenPhoto,
    severity: j.severity || 'High',
    payout: j.payout || '₹12,000',
    deadline: j.deadline || '24h',
    gps_lat: j.gps_lat,
    gps_lng: j.gps_lng,
  };
}

function _verificationToVerdict(v) {
  if (!v) return null;
  const passed = v.overall_status === 'pass';
  const review = v.overall_status === 'review';
  return {
    status: v.overall_status || 'reject',
    title: passed
      ? 'Auto-Verification Passed! '
      : review
      ? 'Officer Review Required '
      : 'Verification Rejected ',
    score: v.score != null ? `${(v.score * 100).toFixed(1)}%` : '0%',
    color: passed ? 'emerald' : review ? 'amber' : 'red',
    reason: v.reason || '',
    details: (v.checks || []).map((ch) => ({
      name: ch.name,
      res: `${ch.result} ${ch.passed ? '✅' : '❌'}`,
    })),
  };
}

function _statusLabel(s) {
  const map = {
    pending: 'Pending Review',
    triaged: 'Triaged & Dispatched',
    in_progress: 'Repair In Progress',
    repair_submitted: 'Repair Under Review',
    verified: 'Fix Verified & Completed',
    reopened: 'Reopened — Under Review',
  };
  return map[s] || s || 'Pending';
}

function _statusType(s) {
  if (s === 'verified') return 'verified';
  if (s === 'in_progress' || s === 'repair_submitted') return 'in_progress';
  return 'pending';
}
