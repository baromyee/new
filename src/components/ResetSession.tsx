"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";

function clearAuthCookies() {
  const names = document.cookie.split(";").map((part) => part.split("=")[0]?.trim());
  for (const name of names) {
    if (!name) continue;
    if (
      name.startsWith("__session") ||
      name.startsWith("__client") ||
      name.startsWith("__clerk") ||
      name.toLowerCase().includes("clerk")
    ) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }
}

export function ResetSession() {
  const { signOut } = useClerk();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function reset() {
      try {
        await signOut({ redirectUrl: "/sign-in" });
      } catch {
        clearAuthCookies();
        if (!cancelled) {
          setFailed(true);
          window.location.replace("/sign-in");
        }
      }
    }

    void reset();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">로그인 정보를 초기화하는 중</h1>
      <p className="mt-2 max-w-md text-zinc-300">
        {failed
          ? "로그인 화면으로 이동합니다."
          : "이전에 남은 로그인 상태를 지우고 로그인 화면으로 보냅니다."}
      </p>
    </div>
  );
}
