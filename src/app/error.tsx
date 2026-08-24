"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { signOut } = useClerk();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">페이지를 불러오지 못했습니다</h1>
      <p className="mt-2 max-w-md text-zinc-300">
        로그인 상태가 꼬여 있을 수 있습니다. 로그아웃한 뒤 다시 들어와 주세요.
      </p>
      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/sign-in" })}
        className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-400"
      >
        로그아웃하고 다시 로그인
      </button>
    </div>
  );
}
