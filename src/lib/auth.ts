const SSO_GATEWAY =
  'https://ttac-gateway-production.up.railway.app/api/v1/open/taylor-access';
const SSO_BASE = SSO_GATEWAY;
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
  role?: string;
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
    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (typeof exp !== 'number') return false;
    return exp * 1000 < Date.now();
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
  await storeUserInfoFromToken(accessToken);

  return accessToken;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function userInfoFromClaims(claims: Record<string, unknown>): StreamUser | null {
  const NS = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/';
  const NS_MS = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/';

  const email =
    (claims.email as string) ||
    (claims[NS + 'emailaddress'] as string) ||
    (claims[NS + 'email'] as string) ||
    '';

  const name =
    (claims.name as string) ||
    (claims[NS + 'name'] as string) ||
    (claims[NS + 'givenname'] as string) ||
    email.split('@')[0] ||
    'User';

  if (!email) return null;

  const sub =
    (claims.userId as string) ||
    (claims.sub as string) ||
    (claims[NS + 'nameidentifier'] as string) ||
    '';

  const role =
    (claims.role as string) ||
    (claims[NS_MS + 'role'] as string) ||
    undefined;

  return { sub, email, name, role };
}

async function storeUserInfoFromToken(token: string): Promise<void> {
  const claims = decodeJwtPayload(token);
  const fromJwt = claims ? userInfoFromClaims(claims) : null;
  if (fromJwt) {
    localStorage.setItem(USER_KEY, JSON.stringify(fromJwt));
    return;
  }

  try {
    const res = await fetch(`${SSO_BASE}/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const userInfo = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    }
  } catch {
    /* optional enrichment only */
  }
}

export function hasValidToken(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/** Portal tile launch — token is issued by TSS Portal, decode locally (no API round-trip). */
export async function handleTokenHandoff(token: string): Promise<void> {
  const claims = decodeJwtPayload(token);
  const user = claims ? userInfoFromClaims(claims) : null;

  if (!user?.email) {
    throw new Error('Could not read your identity from the Portal token. Please try again.');
  }

  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function ensureUserInfo(): Promise<void> {
  if (getUserInfo() || !hasValidToken()) return;
  const token = getToken();
  if (token) await storeUserInfoFromToken(token);
}

export function logout(): void {
  clearToken();
  window.location.href = 'https://tss-portal.com';
}
