import { redirect } from "next/navigation";
import { SetupForm } from "@/components/SetupForm";
import { BasketballIcon } from "@/components/AppHeader";
import { getOrCreateUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const user = await getOrCreateUser();
  if (user.team) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <BasketballIcon className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold">팀과 선수를 등록하세요</h1>
        <p className="mt-2 text-zinc-400">
          처음 한 번만 등록하면 됩니다. 나중에 선수 관리에서 선수를 더 넣을 수 있습니다.
        </p>
      </div>
      <SetupForm />
    </div>
  );
}
