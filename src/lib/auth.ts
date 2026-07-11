const SSO_BASE = 'https://taylor-accesscom-production.up.railway.app';
const SSO_UI = 'https://taylor-access.com';
const CLIENT_ID = 'ta_tss_stream';
const CLIENT_SECRET = 'tss-stream-sso-secret-2026';
const TOKEN_KEY = 'tss_stream_token';
const USER_KEY = 'tss_stream_user';

export interface StreamUser {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  roles?: string[];
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('tss_stream_refresh');
  localStorage.removeItem('sso_state');
  localStorage.removeItem(USER_KEY);
}

export function getUserInfo(): StreamUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StreamUser;
  } catch {
    return null;
  }
}

export function getUserDisplayName(): string {
  const user = getUserInfo();
  if (user?.name) return user.name;
  if (user?.given_name) return user.given_name;
  if (user?.email) return user.email.split('@')[0];
  return 'User';
}

export function getUserEmail(): string {
  return getUserInfo()?.email || '';
}

export function getUserInitials(): string {
  const name = getUserDisplayName();
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!decoded.exp) return false;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function redirectToSSO(): void {
  const redirectUri = encodeURIComponent(window.location.origin + '/callback');
  const scope = encodeURIComponent('openid profile email roles');
  const state = encodeURIComponent(Math.random().toString(36).substring(7));
  localStorage.setItem('sso_state', state);
  window.location.href = `${SSO_UI}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
}

export async function exchangeCode(code: string): Promise<string> {
  const redirectUri = window.location.origin + '/callback';

  const tokenRes = await fetch(`${SSO_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'authorization_code',
      code,
      redirectUri,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => null);
    throw new Error(err?.error_description || err?.error || 'Token exchange failed');
  }

  const data = await tokenRes.json();
  const accessToken = data.accessToken || data.access_token;
  const refreshToken = data.refreshToken || data.refresh_token;

  if (!accessToken) throw new Error('No access token received');

  setToken(accessToken);
  if (refreshToken) localStorage.setItem('tss_stream_refresh', refreshToken);
  await fetchAndStoreUserInfo(accessToken);

  return accessToken;
}

async function fetchAndStoreUserInfo(token: string): Promise<void> {
  const res = await fetch(`${SSO_BASE}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    const userInfo = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }
}

export function hasValidToken(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

export async function handleTokenHandoff(token: string): Promise<void> {
  const res = await fetch(`${SSO_BASE}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Token validation failed');
  }

  const userInfo = await res.json();
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
}

export async function ensureUserInfo(): Promise<void> {
  if (getUserInfo() || !hasValidToken()) return;
  const token = getToken();
  if (token) await fetchAndStoreUserInfo(token);
}

export function logout(): void {
  clearToken();
  window.location.href = 'https://tss-portal.com';
}
