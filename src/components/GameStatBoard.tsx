"use client";

import { useRef, useState } from "react";
import { applyGameStatAction } from "@/app/actions/stats";
import {
  applyStatAction,
  formatPercent,
  type CountField,
  type StatAction,
  type StatCounts,
  type ShotType,
} from "@/lib/stats";

export type PlayerStatRow = {
  statId: string;
  name: string;
  jerseyNumber: number;
  stats: StatCounts;
};

function sameCounts(a: StatCounts, b: StatCounts) {
  return (
    a.pts === b.pts &&
    a.reb === b.reb &&
    a.ast === b.ast &&
    a.stl === b.stl &&
    a.blk === b.blk &&
    a.fgm === b.fgm &&
    a.fga === b.fga &&
    a.tpm === b.tpm &&
    a.tpa === b.tpa &&
    a.ftm === b.ftm &&
    a.fta === b.fta
  );
}

function useQueuedStats(statId: string, initial: StatCounts) {
  const [stats, setStats] = useState(initial);
  const latest = useRef(initial);
  const queue = useRef(Promise.resolve());
  const pending = useRef(0);

  function dispatch(action: StatAction) {
    const next = applyStatAction(latest.current, action);
    if (sameCounts(next, latest.current)) return;
    latest.current = next;
    setStats(next);
    pending.current += 1;
    queue.current = queue.current
      .then(() => applyGameStatAction(statId, action))
      .then((server) => {
        pending.current -= 1;
        if (pending.current === 0) {
          latest.current = server;
          setStats(server);
        }
      })
      .catch(() => {
        pending.current = 0;
        window.location.reload();
      });
  }

  return { stats, dispatch };
}

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg font-bold leading-none hover:bg-white/20";

function CountControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (delta: 1 | -1) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label ? (
        <span className="text-[11px] font-semibold tracking-wide text-zinc-400">{label}</span>
      ) : null}
      <div className="flex items-center gap-1">
        <button type="button" className={iconBtn} onClick={() => onChange(-1)} aria-label={`${label || "값"} 감소`}>
          −
        </button>
        <span className="w-8 text-center text-lg font-bold tabular-nums">{value}</span>
        <button type="button" className={iconBtn} onClick={() => onChange(1)} aria-label={`${label || "값"} 증가`}>
          +
        </button>
      </div>
    </div>
  );
}

function ShotButtons({
  onMade,
  onMiss,
  onUndoMade,
  onUndoMiss,
}: {
  onMade: () => void;
  onMiss: () => void;
  onUndoMade: () => void;
  onUndoMiss: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex justify-center gap-1">
        <button
          type="button"
          onClick={onMade}
          className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-400"
        >
          Made
        </button>
        <button
          type="button"
          onClick={onMiss}
          className="rounded-md bg-zinc-600 px-2 py-1 text-xs font-semibold text-white hover:bg-zinc-500"
        >
          Miss
        </button>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onUndoMade}
          className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-white/10"
        >
          Made 취소
        </button>
        <button
          type="button"
          onClick={onUndoMiss}
          className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-white/10"
        >
          Miss 취소
        </button>
      </div>
    </div>
  );
}

function ShotPanel({
  stats,
  shot,
}: {
  stats: StatCounts;
  shot: (type: ShotType, result: "made" | "miss", undo?: boolean) => void;
}) {
  const cols: { madeLabel: string; attLabel: string; pctLabel: string; made: number; att: number; type: ShotType }[] =
    [
      { madeLabel: "FGM", attLabel: "FGA", pctLabel: "FG%", made: stats.fgm, att: stats.fga, type: "fg" },
      { madeLabel: "3PM", attLabel: "3PA", pctLabel: "3P%", made: stats.tpm, att: stats.tpa, type: "tp" },
      { madeLabel: "FTM", attLabel: "FTA", pctLabel: "FT%", made: stats.ftm, att: stats.fta, type: "ft" },
    ];

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-center">
      {cols.map((col) => (
        <span key={`${col.type}-ml`} className="text-[11px] font-semibold tracking-wide text-zinc-400">
          {col.madeLabel}
        </span>
      ))}
      {cols.map((col) => (
        <span key={`${col.type}-mv`} className="text-lg font-bold tabular-nums">
          {col.made}
        </span>
      ))}
      {cols.map((col) => (
        <span key={`${col.type}-al`} className="text-[11px] font-semibold tracking-wide text-zinc-400">
          {col.attLabel}
        </span>
      ))}
      {cols.map((col) => (
        <span key={`${col.type}-av`} className="text-lg font-bold tabular-nums">
          {col.att}
        </span>
      ))}
      {cols.map((col) => (
        <ShotButtons
          key={`${col.type}-btn`}
          onMade={() => shot(col.type, "made")}
          onMiss={() => shot(col.type, "miss")}
          onUndoMade={() => shot(col.type, "made", true)}
          onUndoMiss={() => shot(col.type, "miss", true)}
        />
      ))}
      {cols.map((col) => (
        <span key={`${col.type}-pl`} className="text-[11px] font-semibold tracking-wide text-zinc-400">
          {col.pctLabel}
        </span>
      ))}
      {cols.map((col) => (
        <span key={`${col.type}-pv`} className="text-lg font-bold tabular-nums">
          {formatPercent(col.made, col.att)}
        </span>
      ))}
    </div>
  );
}

function ReadStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-semibold tracking-wide text-zinc-400">{label}</span>
      <span className={`text-lg font-bold tabular-nums ${accent ? "text-orange-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function usePlayerDispatch(row: PlayerStatRow) {
  const { stats, dispatch } = useQueuedStats(row.statId, row.stats);
  const count = (field: CountField, delta: 1 | -1) =>
    dispatch({ type: "count", field, delta });
  const shot = (shot: ShotType, result: "made" | "miss", undo = false) =>
    dispatch({ type: "shot", shot, result, undo });
  return { stats, count, shot };
}

function PlayerCard({ row }: { row: PlayerStatRow }) {
  const { stats, count, shot } = usePlayerDispatch(row);

  return (
    <article className="space-y-4 rounded-2xl border border-white/10 bg-[#161d2e] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/20 text-lg font-bold text-orange-300">
            {row.jerseyNumber}
          </span>
          <h3 className="text-lg font-semibold">{row.name}</h3>
        </div>
        <ReadStat label="PTS" value={stats.pts} accent />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CountControl label="REB" value={stats.reb} onChange={(d) => count("reb", d)} />
        <CountControl label="AST" value={stats.ast} onChange={(d) => count("ast", d)} />
        <CountControl label="STL" value={stats.stl} onChange={(d) => count("stl", d)} />
        <CountControl label="BLK" value={stats.blk} onChange={(d) => count("blk", d)} />
      </div>
      <div className="border-t border-white/10 pt-3">
        <ShotPanel stats={stats} shot={shot} />
      </div>
    </article>
  );
}

function PlayerTableRow({ row }: { row: PlayerStatRow }) {
  const { stats, count, shot } = usePlayerDispatch(row);

  return (
    <tr className="border-b border-white/10">
      <td className="sticky left-0 bg-[#161d2e] px-3 py-3">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-300">
            {row.jerseyNumber}
          </span>
          <span className="font-medium">{row.name}</span>
        </div>
      </td>
      <td className="px-2 text-center text-lg font-bold tabular-nums text-orange-400">{stats.pts}</td>
      <td className="px-1 py-2">
        <CountControl label="" value={stats.reb} onChange={(d) => count("reb", d)} />
      </td>
      <td className="px-1 py-2">
        <CountControl label="" value={stats.ast} onChange={(d) => count("ast", d)} />
      </td>
      <td className="px-1 py-2">
        <CountControl label="" value={stats.stl} onChange={(d) => count("stl", d)} />
      </td>
      <td className="px-1 py-2">
        <CountControl label="" value={stats.blk} onChange={(d) => count("blk", d)} />
      </td>
      <td className="px-3 py-3">
        <ShotPanel stats={stats} shot={shot} />
      </td>
    </tr>
  );
}

export function GameStatBoard({ rows }: { rows: PlayerStatRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-[#161d2e] px-4 py-10 text-center text-zinc-400">
        이 경기에 연결된 선수가 없습니다. 선수 관리에서 선수를 등록한 뒤 새 경기를 추가하세요.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:hidden">
        {rows.map((row) => (
          <PlayerCard key={row.statId} row={row} />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#161d2e] lg:block">
        <table className="min-w-[860px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-zinc-400">
              <th className="sticky left-0 bg-[#161d2e] px-3 py-3 text-left">선수</th>
              <th className="px-2 py-3">PTS</th>
              <th className="px-2 py-3">REB</th>
              <th className="px-2 py-3">AST</th>
              <th className="px-2 py-3">STL</th>
              <th className="px-2 py-3">BLK</th>
              <th className="px-2 py-3 text-left">슛</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <PlayerTableRow key={row.statId} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
