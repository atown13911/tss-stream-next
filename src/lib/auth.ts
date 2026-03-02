const SSO_BASE = 'https://taylor-accesscom-production.up.railway.app';
const SSO_UI = 'https://taylor-access.com';
const CLIENT_ID = 'ta_tss_stream';
const CLIENT_SECRET = 'tss-stream-sso-secret-2026';
const TOKEN_KEY = 'tss_stream_token';

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

  return accessToken;
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
  localStorage.setItem('tss_stream_user', JSON.stringify(userInfo));
}

export function logout(): void {
  clearToken();
  localStorage.removeItem('tss_stream_user');
  window.location.href = 'https://tss-portal.com';
}
