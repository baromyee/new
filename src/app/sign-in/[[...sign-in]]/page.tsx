import { SignIn } from "@clerk/nextjs";
import { BasketballIcon } from "@/components/BasketballIcon";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <BasketballIcon className="mb-4 h-14 w-14" />
        <h1 className="text-3xl font-bold tracking-tight text-white">CourtBoard</h1>
        <p className="mt-2 max-w-sm text-white">
          농구 선수 스탯 관리. 쉽고, 간편하게
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
