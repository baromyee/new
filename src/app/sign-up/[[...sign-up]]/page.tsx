import { SignUp } from "@clerk/nextjs";
import { BasketballIcon } from "@/components/AppHeader";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BasketballIcon className="mb-4 h-14 w-14" />
        <h1 className="text-3xl font-bold tracking-tight">농구 선수 기록</h1>
        <p className="mt-2 max-w-sm text-zinc-400">
          Google로 가입하면 기록이 계정에 저장됩니다.
        </p>
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        forceRedirectUrl="/"
      />
    </div>
  );
}
