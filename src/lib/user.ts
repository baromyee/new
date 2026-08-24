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
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId;
  } catch {
    redirect("/sign-in");
  }

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    return await prisma.user.upsert({
      where: { clerkUserId: userId },
      create: { clerkUserId: userId },
      update: {},
      include: userInclude,
    });
  } catch (error) {
    const existing = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: userInclude,
    });
    if (existing) return existing;
    console.error("getOrCreateUser failed", error);
    throw error;
  }
}

export async function requireTeam() {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }
  return { user, team: user.team };
}
