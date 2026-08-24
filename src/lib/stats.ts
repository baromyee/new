export type CountField = "reb" | "ast" | "stl" | "blk";
export type ShotType = "fg" | "tp" | "ft";
export type ShotResult = "made" | "miss";

export type StatCounts = {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
};

export type StatAction =
  | { type: "count"; field: CountField; delta: 1 | -1 }
  | { type: "shot"; shot: ShotType; result: ShotResult; undo?: boolean };

export function emptyStats(): StatCounts {
  return {
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    ftm: 0,
    fta: 0,
  };
}

export function pickCounts(s: StatCounts): StatCounts {
  return {
    pts: s.pts,
    reb: s.reb,
    ast: s.ast,
    stl: s.stl,
    blk: s.blk,
    fgm: s.fgm,
    fga: s.fga,
    tpm: s.tpm,
    tpa: s.tpa,
    ftm: s.ftm,
    fta: s.fta,
  };
}

function isValid(s: StatCounts): boolean {
  return (
    s.pts >= 0 &&
    s.reb >= 0 &&
    s.ast >= 0 &&
    s.stl >= 0 &&
    s.blk >= 0 &&
    s.fgm >= 0 &&
    s.fga >= 0 &&
    s.tpm >= 0 &&
    s.tpa >= 0 &&
    s.ftm >= 0 &&
    s.fta >= 0 &&
    s.fgm <= s.fga &&
    s.tpm <= s.tpa &&
    s.ftm <= s.fta &&
    s.tpa <= s.fga &&
    s.tpm <= s.fgm &&
    s.fga - s.fgm >= s.tpa - s.tpm
  );
}

export function applyStatAction(
  stats: StatCounts,
  action: StatAction,
): StatCounts {
  const next = pickCounts(stats);

  if (action.type === "count") {
    next[action.field] = Math.max(0, next[action.field] + action.delta);
    return next;
  }

  const sign = action.undo ? -1 : 1;

  if (action.shot === "fg") {
    next.fga += sign;
    if (action.result === "made") {
      next.fgm += sign;
      next.pts += 2 * sign;
    }
  } else if (action.shot === "tp") {
    next.tpa += sign;
    next.fga += sign;
    if (action.result === "made") {
      next.tpm += sign;
      next.fgm += sign;
      next.pts += 3 * sign;
    }
  } else {
    next.fta += sign;
    if (action.result === "made") {
      next.ftm += sign;
      next.pts += sign;
    }
  }

  if (!isValid(next)) {
    return pickCounts(stats);
  }

  return next;
}

export function percent(made: number, attempts: number): number {
  if (attempts === 0) return 0;
  return (made / attempts) * 100;
}

export function formatPercent(made: number, attempts: number): string {
  return percent(made, attempts).toFixed(1);
}

export type AverageStats = StatCounts & {
  games: number;
  fgPct: number;
  tpPct: number;
  ftPct: number;
};

export function averageStats(games: StatCounts[]): AverageStats {
  const gamesCount = games.length;
  const sum = games.reduce((acc, s) => {
    acc.pts += s.pts;
    acc.reb += s.reb;
    acc.ast += s.ast;
    acc.stl += s.stl;
    acc.blk += s.blk;
    acc.fgm += s.fgm;
    acc.fga += s.fga;
    acc.tpm += s.tpm;
    acc.tpa += s.tpa;
    acc.ftm += s.ftm;
    acc.fta += s.fta;
    return acc;
  }, emptyStats());

  if (gamesCount === 0) {
    return { ...emptyStats(), games: 0, fgPct: 0, tpPct: 0, ftPct: 0 };
  }

  return {
    pts: sum.pts / gamesCount,
    reb: sum.reb / gamesCount,
    ast: sum.ast / gamesCount,
    stl: sum.stl / gamesCount,
    blk: sum.blk / gamesCount,
    fgm: sum.fgm / gamesCount,
    fga: sum.fga / gamesCount,
    tpm: sum.tpm / gamesCount,
    tpa: sum.tpa / gamesCount,
    ftm: sum.ftm / gamesCount,
    fta: sum.fta / gamesCount,
    games: gamesCount,
    fgPct: percent(sum.fgm, sum.fga),
    tpPct: percent(sum.tpm, sum.tpa),
    ftPct: percent(sum.ftm, sum.fta),
  };
}

export function formatAvg(n: number): string {
  return n.toFixed(1);
}
