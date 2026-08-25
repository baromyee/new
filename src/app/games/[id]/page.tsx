import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GameStatBoard } from "@/components/GameStatBoard";
import { pageErrorFallback } from "@/components/LoadError";
import { prisma } from "@/lib/prisma";
import { pickCounts } from "@/lib/stats";
import { requireTeam } from "@/lib/user";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const [{ id }, { team }] = await Promise.all([params, requireTeam()]);

    const game = await prisma.game.findFirst({
      where: { id, teamId: team.id },
      select: {
        id: true,
        name: true,
        stats: {
          select: {
            id: true,
            pts: true,
            reb: true,
            ast: true,
            stl: true,
            blk: true,
            fgm: true,
            fga: true,
            tpm: true,
            tpa: true,
            ftm: true,
            fta: true,
            player: { select: { name: true, jerseyNumber: true } },
          },
          orderBy: { player: { jerseyNumber: "asc" } },
        },
      },
    });

  if (!game) {
    notFound();
  }

  const rows = game.stats.map((stat) => ({
    statId: stat.id,
    name: stat.player.name,
    jerseyNumber: stat.player.jerseyNumber,
    stats: pickCounts(stat),
  }));

  return (
    <div className="min-h-screen">
      <AppHeader teamName={team.name} active="games" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="text-sm text-orange-400 hover:underline">
              ← 경기 목록
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{game.name}</h1>
            <p className="mt-1 text-zinc-400">
              FGA Made는 2점, 3PA Made는 3점과 필드골, FTA Made는 1점입니다.
            </p>
          </div>
        </div>
        <GameStatBoard rows={rows} />
      </main>
    </div>
  );
  } catch (error) {
    return pageErrorFallback(error);
  }
}
