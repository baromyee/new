import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { BasketballIcon } from "@/components/AppHeader";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
}) {
  const segments = (await params)["sign-in"] ?? [];
  const isCallback = segments.length > 0;

  let userId: string | null = null;
  try {
    userId = (await auth()).userId;
  } catch {
    userId = null;
  }

  if (userId && !isCallback) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BasketballIcon className="mb-4 h-14 w-14" />
        <h1 className="text-3xl font-bold tracking-tight text-white">농구 선수 기록</h1>
        <p className="mt-2 max-w-sm text-white">
          Google 계정으로 로그인하면 팀, 선수, 경기 기록이 저장되고 다시 들어와도 그대로 나타납니다.
        </p>
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            footerAction: { display: "none" },
            footerActionText: { display: "none" },
            footerActionLink: { display: "none" },
          },
        }}
      />
    </div>
  );
}
