import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      team: {
        include: {
          players: { orderBy: { jerseyNumber: "asc" } },
          games: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: { clerkUserId: userId },
    include: {
      team: {
        include: {
          players: { orderBy: { jerseyNumber: "asc" } },
          games: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });
}

export async function requireTeam() {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }
  return { user, team: user.team };
}
