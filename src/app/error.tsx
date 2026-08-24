"use client";

import { useEffect } from "react";
import { ResetSession } from "@/components/ResetSession";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ResetSession />;
}
