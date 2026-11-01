'use client';

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-2"
    >
      🖨️ {label}
    </button>
  );
}
