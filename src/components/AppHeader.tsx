import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

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

const navClass =
  "rounded-full px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white";

export function AppHeader({
  teamName,
  active,
}: {
  teamName?: string;
  active?: "games" | "players" | "roster";
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1020]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold text-orange-400">
          <BasketballIcon className="h-8 w-8 shrink-0" />
          <span className="truncate">농구 기록</span>
        </Link>
        {teamName ? (
          <p className="hidden truncate text-sm text-zinc-400 md:block">{teamName}</p>
        ) : null}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`${navClass} ${active === "games" ? "bg-orange-500/20 text-orange-300" : ""}`}
          >
            경기
          </Link>
          <Link
            href="/players"
            className={`${navClass} ${active === "players" ? "bg-orange-500/20 text-orange-300" : ""}`}
          >
            선수 기록
          </Link>
          <Link
            href="/roster"
            className={`${navClass} ${active === "roster" ? "bg-orange-500/20 text-orange-300" : ""}`}
          >
            선수 관리
          </Link>
          <div className="ml-1">
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
