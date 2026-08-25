import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { errorMessage } from "@/lib/errors";
import { describeDatabaseTarget } from "@/lib/db-url";
import { prisma } from "@/lib/prisma";

export const getOrCreateUser = cache(async () => {
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
    const existing = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        clerkUserId: true,
        team: { select: { id: true, name: true } },
      },
    });
    if (existing) {
      return existing;
    }

    try {
      return await prisma.user.create({
        data: { clerkUserId: userId },
        select: {
          id: true,
          clerkUserId: true,
          team: { select: { id: true, name: true } },
        },
      });
    } catch {
      const raced = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: {
          id: true,
          clerkUserId: true,
          team: { select: { id: true, name: true } },
        },
      });
      if (raced) return raced;
      throw new Error("사용자 정보를 만들지 못했습니다.");
    }
  } catch (error) {
    throw new Error(
      `데이터베이스 인증에 실패했습니다. Vercel DATABASE_URL을 Neon의 Pooled 연결 문자열로 다시 넣으세요. (${describeDatabaseTarget()}) (${errorMessage(error)})`,
    );
  }
});

export const requireTeam = cache(async () => {
  const user = await getOrCreateUser();
  if (!user.team) {
    redirect("/setup");
  }

  return { user, team: user.team };
});
