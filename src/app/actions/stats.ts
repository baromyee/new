"use server";

import { prisma } from "@/lib/prisma";
import { applyStatAction, pickCounts, type StatAction, type StatCounts } from "@/lib/stats";
import { requireTeam } from "@/lib/user";

export async function applyGameStatAction(
  statId: string,
  action: StatAction,
): Promise<StatCounts> {
  const { team } = await requireTeam();

  const current = await prisma.gameStat.findFirst({
    where: { id: statId, game: { teamId: team.id } },
  });

  if (!current) {
    throw new Error("기록을 찾을 수 없습니다.");
  }

  const next = applyStatAction(pickCounts(current), action);

  const updated = await prisma.gameStat.update({
    where: { id: statId },
    data: next,
  });

  return pickCounts(updated);
}
