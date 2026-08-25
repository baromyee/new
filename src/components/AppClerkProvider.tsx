"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ComponentProps, ReactNode } from "react";

export function AppClerkProvider({
  children,
  appearance,
}: {
  children: ReactNode;
  appearance: ComponentProps<typeof ClerkProvider>["appearance"];
}) {
  return (
    <ClerkProvider
      appearance={appearance}
      signInFallbackRedirectUrl="/"
      afterSignOutUrl="/sign-in"
      // Clerk 클라이언트 세션 동기화 때 페이지를 다시 불러오며 에러 화면으로 덮는 것을 막습니다.
      {...{
        __internal_invokeMiddlewareOnAuthStateChange: false,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
