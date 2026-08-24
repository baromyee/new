"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">페이지를 불러오지 못했습니다</h1>
      <p className="mt-2 max-w-md text-zinc-300">
        로그인 화면에서 다시 들어와 주세요. 같은 화면이 반복되면 잠시 후 다시 시도하세요.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400"
        >
          다시 시도
        </button>
        <Link
          href="/sign-in"
          className="rounded-xl bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/15"
        >
          로그인으로
        </Link>
      </div>
    </div>
  );
}
