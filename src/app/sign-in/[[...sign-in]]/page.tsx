import { SignIn } from "@clerk/nextjs";
import { BasketballIcon } from "@/components/BasketballIcon";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BasketballIcon className="mb-4 h-14 w-14" />
        <h1 className="text-3xl font-bold tracking-tight text-white">농구 선수 기록</h1>
        <p className="mt-2 max-w-sm text-white">
          시작할 때마다 Google 로그인이 필요합니다. 팀과 경기 기록은 계정에 저장됩니다.
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
