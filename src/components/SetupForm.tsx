"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTeam, type PlayerInput } from "@/app/actions/team";

type DraftPlayer = PlayerInput & { key: string };

export function SetupForm() {
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<DraftPlayer[]>([
    { key: "p-1", name: "", jerseyNumber: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function addRow() {
    setPlayers((prev) => [
      ...prev,
      { key: `p-${Date.now()}`, name: "", jerseyNumber: prev.length + 1 },
    ]);
  }

  function updatePlayer(key: string, patch: Partial<PlayerInput>) {
    setPlayers((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    );
  }

  function removePlayer(key: string) {
    setPlayers((prev) => (prev.length === 1 ? prev : prev.filter((p) => p.key !== key)));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createTeam({
        name: teamName,
        players: players.map(({ name, jerseyNumber }) => ({ name, jerseyNumber })),
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-300">팀 이름</span>
        <input
          required
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="예: 호랑이"
          className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none ring-orange-500 placeholder:text-zinc-500 focus:ring-2"
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-300">선수 등록</h2>
          <button
            type="button"
            onClick={addRow}
            className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
          >
            선수 추가
          </button>
        </div>

        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={player.key}
              className="grid grid-cols-[4.5rem_1fr_auto] gap-2 rounded-xl border border-white/10 bg-[#161d2e] p-2"
            >
              <input
                required
                type="number"
                min={0}
                max={99}
                value={player.jerseyNumber}
                onChange={(e) =>
                  updatePlayer(player.key, { jerseyNumber: Number(e.target.value) })
                }
                aria-label={`${index + 1}번 선수 등번호`}
                className="rounded-lg border border-white/10 bg-[#0b1020] px-2 py-2 text-center outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                required
                value={player.name}
                onChange={(e) => updatePlayer(player.key, { name: e.target.value })}
                placeholder="선수 이름"
                className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => removePlayer(player.key)}
                className="rounded-lg px-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-red-300"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-400"
      >
        {pending ? "저장 중..." : "팀 만들고 시작하기"}
      </button>
    </form>
  );
}
