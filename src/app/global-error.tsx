"use client";

import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ResetSession } from "@/components/ResetSession";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#0b1020]">
        <ClerkProvider afterSignOutUrl="/sign-in">
          <ResetSession />
        </ClerkProvider>
      </body>
    </html>
  );
}
