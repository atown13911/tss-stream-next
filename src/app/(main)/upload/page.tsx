'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { CATEGORY_SLUGS } from '@/lib/videos';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('trucking');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (f: File) => {
    if (!f.type.startsWith('video/')) {
      setError('Please select a video file.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Please add a title.');
      return;
    }
    if (!file) {
      setError('Please select a video file.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('video', file);
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('category', category);
      fd.append('tags', tags);

      const res = await fetch(`${API_URL}/api/videos`, { method: 'POST', body: fd });
      if (res.ok) {
        const v = await res.json();
        router.push(`/watch?id=${v.id}`);
        return;
      }
      const err = await res.json().catch(() => null);
      setError(err?.error || 'Upload failed.');
    } catch {
      setError('Upload failed — check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      {!file ? (
        <label
          className="flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <span className="material-icons-round text-5xl text-sky-500/50">cloud_upload</span>
          <p className="text-sm text-slate-400">Drag & drop a video, or click to browse</p>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="space-y-4">
          {preview && (
            <video src={preview} controls className="w-full rounded-xl bg-black aspect-video" />
          )}
          <p className="text-xs text-slate-500">{file.name}</p>
          <button
            onClick={() => { setFile(null); setPreview(''); }}
            className="text-sm text-sky-400 hover:underline cursor-pointer"
          >
            Change file
          </button>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-500"
              placeholder="Video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-500 resize-none"
              placeholder="Tell viewers about your video"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-500"
              >
                {CATEGORY_SLUGS.map((c) => (
                  <option key={c} value={c}>{c.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-500"
                placeholder="comma, separated, tags"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handlePublish}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-icons-round text-[20px]">{uploading ? 'hourglass_top' : 'publish'}</span>
            {uploading ? 'Uploading...' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );
}
