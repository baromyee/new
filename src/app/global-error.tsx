"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0b1020] px-4 text-center">
        <h1 className="text-2xl font-bold text-white">페이지를 불러오지 못했습니다</h1>
        <p className="mt-2 max-w-md text-zinc-300">잠시 후 다시 시도해 주세요.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-400"
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
