import Link from "next/link";
import { errorMessage, isNavigationError } from "@/lib/errors";

export function LoadError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">데이터를 불러오지 못했습니다</h1>
      <p className="mt-3 max-w-lg break-all text-sm text-zinc-300">{message}</p>
      <p className="mt-2 max-w-md text-zinc-400">
        Vercel의 DATABASE_URL(Neon pooled)과 Clerk 키를 확인한 뒤 다시 시도해 주세요.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-400"
      >
        다시 시도
      </Link>
    </div>
  );
}

export function pageErrorFallback(error: unknown) {
  if (isNavigationError(error)) throw error;
  return <LoadError message={errorMessage(error)} />;
}
