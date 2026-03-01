const AUTH_API = 'https://taylor-accesscom-production.up.railway.app/api/v1/auth';
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

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || data?.message || 'Authentication failed');
  }

  const data = await res.json();
  const token = data.token;
  if (!token) throw new Error('No token received');

  setToken(token);
  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearToken();
  window.location.reload();
}
