import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return prisma.user.upsert({
    where: { clerkUserId: userId },
    create: { clerkUserId: userId },
    update: {},
    include: { team: true },
  });
}

export async function requireTeam() {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }

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
}
