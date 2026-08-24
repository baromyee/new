import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
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
    colorText: "#f4f4f5",
    colorTextSecondary: "#a1a1aa",
    colorInputBackground: "#0b1020",
    colorInputText: "#f4f4f5",
    borderRadius: "0.75rem",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className={`${notoSansKr.className} min-h-full antialiased`}>
        <ClerkProvider
          localization={koKR}
          afterSignOutUrl="/sign-in"
          appearance={clerkAppearance}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
