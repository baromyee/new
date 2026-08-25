"use client";

import { useClerk, useSession } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  clearTabAuth,
  hasTabAuth,
  isFreshLogin,
  markTabAuthenticated,
} from "@/lib/tab-auth";

function isAuthPath(pathname: string | null) {
  return Boolean(pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up"));
}

export function StartAtLogin({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, session } = useSession();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();
  const authPage = isAuthPath(pathname);
  const [allowed, setAllowed] = useState(authPage);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    async function gate() {
      const fresh = isFreshLogin(session?.createdAt);

      if (authPage) {
        if (isSignedIn && (hasTabAuth() || fresh)) {
          markTabAuthenticated();
          router.replace("/");
          return;
        }
        if (isSignedIn) {
          clearTabAuth();
          try {
            await signOut({ redirectUrl: "/sign-in" });
          } catch {
            window.location.replace("/sign-in");
          }
          return;
        }
        if (!cancelled) setAllowed(true);
        return;
      }

      if (!isSignedIn) {
        clearTabAuth();
        if (!cancelled) setAllowed(true);
        return;
      }

      if (hasTabAuth() || fresh) {
        markTabAuthenticated();
        if (!cancelled) setAllowed(true);
        return;
      }

      clearTabAuth();
      try {
        await signOut({ redirectUrl: "/sign-in" });
      } catch {
        window.location.replace("/sign-in");
      }
    }

    void gate();
    return () => {
      cancelled = true;
    };
  }, [authPage, isLoaded, isSignedIn, router, session?.createdAt, signOut]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-sm text-zinc-400">로그인 화면으로 이동 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
