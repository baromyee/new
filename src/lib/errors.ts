export function isNavigationError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  const digest =
    "digest" in error && typeof error.digest === "string" ? error.digest : "";
  const message = error instanceof Error ? error.message : "";
  return (
    digest.includes("NEXT_REDIRECT") ||
    digest.includes("NEXT_NOT_FOUND") ||
    message === "NEXT_REDIRECT" ||
    message === "NEXT_NOT_FOUND"
  );
}

export function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "알 수 없는 오류입니다.";
}
