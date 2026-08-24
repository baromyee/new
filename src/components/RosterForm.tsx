"use client";

import { useState, useTransition } from "react";
import { addPlayer, deletePlayer } from "@/app/actions/team";

type RosterPlayer = {
  id: string;
  name: string;
  jerseyNumber: number;
};

export function RosterForm({ players }: { players: RosterPlayer[] }) {
  const [name, setName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addPlayer({ name, jerseyNumber });
      if (result.error) {
        setError(result.error);
        return;
      }
      setName("");
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onAdd} className="grid gap-3 rounded-2xl border border-white/10 bg-[#161d2e] p-4 sm:grid-cols-[5rem_1fr_auto]">
        <input
          required
          type="number"
          min={0}
          max={99}
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(Number(e.target.value))}
          aria-label="등번호"
          className="rounded-xl border border-white/10 bg-[#0b1020] px-3 py-3 text-center outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="새 선수 이름"
          className="rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-400"
        >
          {pending ? "추가 중..." : "선수 추가"}
        </button>
      </form>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#161d2e]">
        {players.length === 0 ? (
          <li className="px-4 py-8 text-center text-zinc-400">등록된 선수가 없습니다.</li>
        ) : (
          players.map((player) => (
            <li key={player.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-300">
                  {player.jerseyNumber}
                </span>
                <span className="font-medium">{player.name}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    await deletePlayer(player.id);
                  })
                }
                className="rounded-lg px-3 py-1 text-sm text-zinc-400 hover:bg-white/5 hover:text-red-300"
              >
                삭제
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
