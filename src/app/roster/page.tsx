import { AppHeader } from "@/components/AppHeader";
import { pageErrorFallback } from "@/components/LoadError";
import { RosterForm } from "@/components/RosterForm";
import { prisma } from "@/lib/prisma";
import { requireTeam } from "@/lib/user";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function RosterPage() {
  try {
    const { team } = await requireTeam();
    const players = await prisma.player.findMany({
      where: { teamId: team.id },
      select: { id: true, name: true, jerseyNumber: true },
      orderBy: { jerseyNumber: "asc" },
    });

    return (
      <div className="min-h-screen">
        <AppHeader teamName={team.name} active="roster" />
        <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          <div>
            <h1 className="text-3xl font-bold">선수 관리</h1>
            <p className="mt-1 text-zinc-400">
              새로 추가한 선수는 이후에 만드는 경기부터 기록 화면에 나타납니다.
            </p>
          </div>
          <RosterForm players={players} />
        </main>
      </div>
    );
  } catch (error) {
    return pageErrorFallback(error);
  }
}
