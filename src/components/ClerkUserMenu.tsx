"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";

class QuietBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function ClerkUserMenu() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="h-8 w-8" aria-hidden />;
  }

  return (
    <QuietBoundary>
      <ClerkLoaded>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </QuietBoundary>
  );
}
