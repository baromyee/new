import Link from "next/link";
import { BasketballIcon } from "@/components/BasketballIcon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <BasketballIcon className="mb-4 h-12 w-12" />
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <Link href="/" prefetch={false} className="mt-4 text-orange-400 hover:underline">
        경기 목록으로
      </Link>
    </div>
  );
}
