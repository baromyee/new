"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTeam } from "@/lib/user";

export async function createGame(
  name: string,
): Promise<{ id?: string; error?: string }> {
  const { team } = await requireTeam();
  const gameName = name.trim();
  if (!gameName) {
    return { error: "경기 이름을 입력하세요." };
  }

  const players = await prisma.player.findMany({
    where: { teamId: team.id },
    select: { id: true },
  });

  const game = await prisma.game.create({
    data: {
      name: gameName,
      teamId: team.id,
      stats: {
        create: players.map((player) => ({ playerId: player.id })),
      },
    },
  });

  revalidatePath("/");
  return { id: game.id };
}

export async function deleteGame(gameId: string) {
  const { team } = await requireTeam();
  await prisma.game.deleteMany({
    where: { id: gameId, teamId: team.id },
  });
  revalidatePath("/");
}
