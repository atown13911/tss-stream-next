const API_URL = 'https://api-production-7b78.up.railway.app';

export async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { method: 'POST', body: formData });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function apiDelete(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}${path}`, { method: 'DELETE' });
    return res.ok;
  } catch {}
  return false;
}

export { API_URL };
