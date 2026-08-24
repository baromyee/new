import Link from "next/link";
import { AddGameForm } from "@/components/AddGameForm";
import { AppHeader } from "@/components/AppHeader";
import { BasketballIcon } from "@/components/BasketballIcon";
import { requireTeam } from "@/lib/user";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  try {
    const { team } = await requireTeam();
    const games = team.games ?? [];

    return (
      <div className="min-h-screen">
        <AppHeader teamName={team.name} active="games" />
        <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-orange-400">{team.name}</p>
              <h1 className="text-3xl font-bold">경기</h1>
              <p className="mt-1 text-zinc-400">경기를 추가한 뒤 아이콘을 눌러 스탯을 기록하세요.</p>
            </div>
            <Link
              href="/players"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15"
            >
              선수 기록 보기
            </Link>
          </div>

          <section className="rounded-2xl border border-white/10 bg-[#161d2e] p-4">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">새 경기 추가</h2>
            <AddGameForm />
          </section>

          {games.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 px-4 py-16 text-center text-zinc-400">
              아직 경기가 없습니다. 위에서 경기 이름을 넣고 추가하세요.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <li key={game.id}>
                  <Link
                    href={`/games/${game.id}`}
                    className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-[#161d2e] p-5 transition hover:border-orange-500/50 hover:bg-[#1c2540]"
                  >
                    <BasketballIcon className="h-12 w-12" />
                    <div>
                      <h3 className="text-lg font-semibold">{game.name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {new Date(game.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("HomePage failed", error);
    throw error;
  }
}
