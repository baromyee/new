"use client";

import { useClerk, useSession } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LoadingScreen, loadingMessageForPath } from "@/components/LoadingScreen";
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
  const [goingToLogin, setGoingToLogin] = useState(false);

  useEffect(() => {
    if (authPage || allowed) return;
    if (hasTabAuth()) setAllowed(true);
  }, [allowed, authPage]);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    async function gate() {
      const fresh = isFreshLogin(session?.createdAt);

      if (authPage) {
        if (isSignedIn && (hasTabAuth() || fresh)) {
          markTabAuthenticated();
          setGoingToLogin(false);
          setAllowed(true);
          router.replace("/");
          return;
        }
        if (isSignedIn) {
          setGoingToLogin(true);
          clearTabAuth();
          try {
            await signOut({ redirectUrl: "/sign-in" });
          } catch {
            window.location.replace("/sign-in");
          }
          return;
        }
        if (!cancelled) {
          setGoingToLogin(false);
          setAllowed(true);
        }
        return;
      }

      if (!isSignedIn) {
        setGoingToLogin(true);
        clearTabAuth();
        if (!cancelled) setAllowed(true);
        return;
      }

      if (hasTabAuth() || fresh) {
        markTabAuthenticated();
        if (!cancelled) {
          setGoingToLogin(false);
          setAllowed(true);
        }
        return;
      }

      setGoingToLogin(true);
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
    return <LoadingScreen message={loadingMessageForPath(pathname, goingToLogin)} />;
  }

  return <>{children}</>;
}
