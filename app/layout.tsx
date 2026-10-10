import type { Metadata } from "next";
import { ReactNode } from "react";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaSetu — Legal Intelligence Platform",
  description:
    "AI-powered legal intelligence platform for citizens and lawyers. Document summarization, legal research, AI assistance, and advocate marketplace.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
