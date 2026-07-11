import Link from 'next/link';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="material-icons-round text-5xl text-slate-600 mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-md">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
