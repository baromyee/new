"use client";

import Link from "next/link";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import { BasketballIcon } from "@/components/BasketballIcon";

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
          <div className="ml-1 min-h-8 min-w-8">
            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </ClerkLoaded>
          </div>
        </nav>
      </div>
    </header>
  );
}
