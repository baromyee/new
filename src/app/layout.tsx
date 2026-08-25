import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AppClerkProvider } from "@/components/AppClerkProvider";
import { StartAtLogin } from "@/components/StartAtLogin";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "CourtBoard",
  description: "농구 선수 스탯 관리. 쉽고, 간편하게",
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
        <AppClerkProvider appearance={clerkAppearance}>
          <StartAtLogin>{children}</StartAtLogin>
        </AppClerkProvider>
      </body>
    </html>
  );
}
