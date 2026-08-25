"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { clearTabAuth } from "@/lib/tab-auth";

export function LogoutButton() {
  const { signOut } = useClerk();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    if (pending) return;
    setPending(true);
    clearTabAuth();
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } catch {
      window.location.replace("/sign-in");
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onLogout()}
      disabled={pending}
      className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
    >
      {pending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
