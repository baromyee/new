"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/app/actions/games";

export function AddGameForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createGame(name);
      if (result.error || !result.id) {
        setError(result.error ?? "경기를 추가하지 못했습니다.");
        return;
      }
      router.push(`/games/${result.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="경기 이름 (예: vs 독수리 3월 2일)"
        className="flex-1 rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 outline-none ring-orange-500 placeholder:text-zinc-500 focus:ring-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-400"
      >
        {pending ? "추가 중..." : "경기 추가"}
      </button>
      {error ? <p className="text-sm text-red-400 sm:hidden">{error}</p> : null}
    </form>
  );
}
