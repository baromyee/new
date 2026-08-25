import { AppHeader } from "@/components/AppHeader";
import { pageErrorFallback } from "@/components/LoadError";
import { prisma } from "@/lib/prisma";
import { averageStats, formatAvg, pickCounts } from "@/lib/stats";
import { requireTeam } from "@/lib/user";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PlayersPage() {
  try {
    const { team } = await requireTeam();

    const players = await prisma.player.findMany({
      where: { teamId: team.id },
      include: { stats: true },
      orderBy: { jerseyNumber: "asc" },
    });

  const rows = players.map((player) => {
    const avg = averageStats(player.stats.map(pickCounts));
    return { player, avg };
  });

  return (
    <div className="min-h-screen">
      <AppHeader teamName={team.name} active="players" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">선수 기록</h1>
          <p className="mt-1 text-zinc-400">
            등록된 선수의 전 경기 평균입니다. 성공률은 합친 성공 / 합친 시도입니다.
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-[#161d2e] px-4 py-10 text-center text-zinc-400">
            등록된 선수가 없습니다.
          </p>
        ) : (
          <>
            <div className="space-y-4 lg:hidden">
              {rows.map(({ player, avg }) => (
                <article
                  key={player.id}
                  className="space-y-3 rounded-2xl border border-white/10 bg-[#161d2e] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-300">
                        {player.jerseyNumber}
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold">{player.name}</h2>
                        <p className="text-xs text-zinc-400">{avg.games}경기</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-zinc-400">PTS</p>
                      <p className="text-xl font-bold text-orange-400">{formatAvg(avg.pts)}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 text-center text-sm">
                    <Stat label="REB" value={formatAvg(avg.reb)} />
                    <Stat label="AST" value={formatAvg(avg.ast)} />
                    <Stat label="STL" value={formatAvg(avg.stl)} />
                    <Stat label="BLK" value={formatAvg(avg.blk)} />
                    <Stat label="FGM" value={formatAvg(avg.fgm)} />
                    <Stat label="FGA" value={formatAvg(avg.fga)} />
                    <Stat label="FG%" value={avg.fgPct.toFixed(1)} />
                    <Stat label="3PM" value={formatAvg(avg.tpm)} />
                    <Stat label="3PA" value={formatAvg(avg.tpa)} />
                    <Stat label="3P%" value={avg.tpPct.toFixed(1)} />
                    <Stat label="FTM" value={formatAvg(avg.ftm)} />
                    <Stat label="FTA" value={formatAvg(avg.fta)} />
                    <Stat label="FT%" value={avg.ftPct.toFixed(1)} />
                  </dl>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#161d2e] lg:block">
              <table className="min-w-[980px] w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-zinc-400">
                    <th className="px-4 py-3 text-left">선수</th>
                    <th className="px-2 py-3">경기</th>
                    <th className="px-2 py-3">PTS</th>
                    <th className="px-2 py-3">REB</th>
                    <th className="px-2 py-3">AST</th>
                    <th className="px-2 py-3">STL</th>
                    <th className="px-2 py-3">BLK</th>
                    <th className="px-2 py-3">FGM</th>
                    <th className="px-2 py-3">FGA</th>
                    <th className="px-2 py-3">FG%</th>
                    <th className="px-2 py-3">3PM</th>
                    <th className="px-2 py-3">3PA</th>
                    <th className="px-2 py-3">3P%</th>
                    <th className="px-2 py-3">FTM</th>
                    <th className="px-2 py-3">FTA</th>
                    <th className="px-2 py-3">FT%</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ player, avg }) => (
                    <tr key={player.id} className="border-b border-white/10">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-300">
                            {player.jerseyNumber}
                          </span>
                          {player.name}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center tabular-nums">{avg.games}</td>
                      <td className="px-2 py-3 text-center font-semibold tabular-nums text-orange-400">
                        {formatAvg(avg.pts)}
                      </td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.reb)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.ast)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.stl)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.blk)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.fgm)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.fga)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{avg.fgPct.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.tpm)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.tpa)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{avg.tpPct.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.ftm)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{formatAvg(avg.fta)}</td>
                      <td className="px-2 py-3 text-center tabular-nums">{avg.ftPct.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
  } catch (error) {
    return pageErrorFallback(error);
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-2">
      <dt className="text-[11px] text-zinc-400">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
