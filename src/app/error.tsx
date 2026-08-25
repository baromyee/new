"use client";

import { useEffect } from "react";

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

  const detail = error.message && error.message !== "An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error."
    ? error.message
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">페이지를 불러오지 못했습니다</h1>
      <p className="mt-2 max-w-md text-zinc-300">화면을 그린 뒤 다시 불러오는 과정에서 오류가 났습니다. 다시 시도해 주세요.</p>
      {detail ? <p className="mt-3 max-w-lg break-all text-sm text-zinc-400">{detail}</p> : null}
      {error.digest ? (
        <p className="mt-2 text-xs text-zinc-500">오류 코드: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-400"
      >
        다시 시도
      </button>
    </div>
  );
}
