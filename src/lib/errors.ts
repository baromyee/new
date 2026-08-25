import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isHTTPAccessFallbackError } from "next/dist/client/components/http-access-fallback/http-access-fallback";

export function isNavigationError(error: unknown) {
  if (isRedirectError(error) || isHTTPAccessFallbackError(error)) {
    return true;
  }
  if (typeof error !== "object" || error === null) return false;
  const digest =
    "digest" in error && typeof error.digest === "string" ? error.digest : "";
  const message = error instanceof Error ? error.message : "";
  return (
    digest.includes("NEXT_REDIRECT") ||
    digest.includes("NEXT_NOT_FOUND") ||
    digest.includes("NEXT_HTTP_ERROR") ||
    message.includes("NEXT_REDIRECT") ||
    message.includes("NEXT_NOT_FOUND")
  );
}

export function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "알 수 없는 오류입니다.";
}
