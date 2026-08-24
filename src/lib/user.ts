import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const userInclude = {
  team: {
    include: {
      players: { orderBy: { jerseyNumber: "asc" as const } },
      games: { orderBy: { createdAt: "desc" as const } },
    },
  },
} satisfies Prisma.UserInclude;

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return prisma.user.upsert({
    where: { clerkUserId: userId },
    create: { clerkUserId: userId },
    update: {},
    include: userInclude,
  });
}

export async function requireTeam() {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }
  return { user, team: user.team };
}
