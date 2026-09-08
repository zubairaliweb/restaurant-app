const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-ember)]/20 border-t-[var(--color-ember)]" />
    <p className="font-body text-sm text-[var(--color-ink)]/60">{label}</p>
  </div>
);

export default Loader;
