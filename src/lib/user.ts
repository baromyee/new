import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { errorMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId;
  } catch (error) {
    throw new Error(
      `Clerk 인증에 실패했습니다. Vercel의 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY와 CLERK_SECRET_KEY가 같은 앱의 값인지 확인하세요. (${errorMessage(error)})`,
    );
  }

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    return await prisma.user.upsert({
      where: { clerkUserId: userId },
      create: { clerkUserId: userId },
      update: {},
      include: { team: true },
    });
  } catch (error) {
    throw new Error(
      `데이터베이스에 연결하지 못했습니다. Vercel DATABASE_URL이 Neon pooled 주소(-pooler 포함)인지 확인하세요. (${errorMessage(error)})`,
    );
  }
}

export async function requireTeam() {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }

  try {
    const [players, games] = await Promise.all([
      prisma.player.findMany({
        where: { teamId: user.team.id },
        orderBy: { jerseyNumber: "asc" },
      }),
      prisma.game.findMany({
        where: { teamId: user.team.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      user,
      team: {
        ...user.team,
        players,
        games,
      },
    };
  } catch (error) {
    throw new Error(
      `팀 데이터를 불러오지 못했습니다. Neon 프로젝트가 일시 정지됐는지 확인하세요. (${errorMessage(error)})`,
    );
  }
}
