export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}

export function loadingMessageForPath(pathname: string | null, goingToLogin = false) {
  if (goingToLogin) return "로그인 화면으로 이동 중...";
  if (!pathname || pathname === "/" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return "팀 정보를 불러오는 중...";
  }
  if (pathname.startsWith("/setup")) return "팀 등록 화면으로 이동 중...";
  if (pathname.startsWith("/players")) return "선수 기록을 불러오는 중...";
  if (pathname.startsWith("/roster")) return "선수 관리 화면으로 이동 중...";
  if (pathname.startsWith("/games/")) return "경기 기록을 불러오는 중...";
  return "페이지를 불러오는 중...";
}
