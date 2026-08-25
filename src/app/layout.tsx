import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AppClerkProvider } from "@/components/AppClerkProvider";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "농구 선수 기록",
  description: "경기별 농구 스탯을 기록하고 전 경기 평균을 확인하세요.",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#f97316",
    colorBackground: "#161d2e",
    colorText: "#ffffff",
    colorTextSecondary: "#ffffff",
    colorInputBackground: "#0b1020",
    colorInputText: "#ffffff",
    borderRadius: "0.75rem",
  },
  elements: {
    headerTitle: { color: "#ffffff" },
    headerSubtitle: { color: "#ffffff" },
    formFieldLabel: { color: "#ffffff" },
    identityPreviewText: { color: "#ffffff" },
    identityPreviewEditButton: { color: "#ffffff" },
    socialButtonsBlockButton: { color: "#ffffff" },
    socialButtonsBlockButtonText: { color: "#ffffff" },
    footerAction: { display: "none" },
    footerActionText: { display: "none" },
    footerActionLink: { display: "none" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className={`${notoSansKr.className} min-h-full antialiased`}>
        <AppClerkProvider appearance={clerkAppearance}>{children}</AppClerkProvider>
      </body>
    </html>
  );
}
