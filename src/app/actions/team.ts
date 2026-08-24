"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser, requireTeam } from "@/lib/user";

export type PlayerInput = {
  name: string;
  jerseyNumber: number;
};

export async function createTeam(form: {
  name: string;
  players: PlayerInput[];
}): Promise<{ error?: string }> {
  const user = await getOrCreateUser();
  if (user.team) {
    return {};
  }

  const teamName = form.name.trim();
  const players = form.players
    .map((p) => ({
      name: p.name.trim(),
      jerseyNumber: Number(p.jerseyNumber),
    }))
    .filter((p) => p.name.length > 0 && Number.isInteger(p.jerseyNumber));

  if (!teamName) {
    return { error: "팀 이름을 입력하세요." };
  }
  if (players.length < 1) {
    return { error: "선수를 한 명 이상 등록하세요." };
  }
  if (players.some((p) => p.jerseyNumber < 0 || p.jerseyNumber > 99)) {
    return { error: "등번호는 0부터 99까지입니다." };
  }

  const numbers = players.map((p) => p.jerseyNumber);
  if (new Set(numbers).size !== numbers.length) {
    return { error: "등번호가 겹칩니다." };
  }

  await prisma.team.create({
    data: {
      name: teamName,
      userId: user.id,
      players: { create: players },
    },
  });

  revalidatePath("/");
  return {};
}

export async function addPlayer(form: PlayerInput): Promise<{ error?: string }> {
  const { team } = await requireTeam();
  const name = form.name.trim();
  const jerseyNumber = Number(form.jerseyNumber);

  if (!name) {
    return { error: "선수 이름을 입력하세요." };
  }
  if (!Number.isInteger(jerseyNumber) || jerseyNumber < 0 || jerseyNumber > 99) {
    return { error: "등번호는 0부터 99까지입니다." };
  }

  const duplicate = await prisma.player.findFirst({
    where: { teamId: team.id, jerseyNumber },
  });
  if (duplicate) {
    return { error: "이미 같은 등번호가 있습니다." };
  }

  await prisma.player.create({
    data: { name, jerseyNumber, teamId: team.id },
  });

  revalidatePath("/");
  revalidatePath("/roster");
  revalidatePath("/players");
  return {};
}

export async function deletePlayer(playerId: string) {
  const { team } = await requireTeam();
  await prisma.player.deleteMany({
    where: { id: playerId, teamId: team.id },
  });
  revalidatePath("/");
  revalidatePath("/roster");
  revalidatePath("/players");
}
