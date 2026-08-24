export function BasketballIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#f97316" />
      <path
        d="M32 2c16.6 0 30 13.4 30 30S48.6 62 32 62 2 48.6 2 32 15.4 2 32 2z"
        fill="none"
        stroke="#7c2d12"
        strokeWidth="3"
      />
      <path d="M32 2v60M2 32h60" fill="none" stroke="#7c2d12" strokeWidth="3" />
      <path
        d="M12 12c8 14 8 26 0 40M52 12c-8 14-8 26 0 40"
        fill="none"
        stroke="#7c2d12"
        strokeWidth="3"
      />
    </svg>
  );
}
