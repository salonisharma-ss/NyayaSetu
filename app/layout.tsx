import type { Metadata } from "next";
import { ReactNode } from "react";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaSetu — Indian Legal Intelligence",
  description:
    "Structured intake → grounded AI legal research → assisted drafting, plus a citizen legal-information assistant and a verified-advocate directory.",
};

// The app is Convex-client driven; render dynamically so the production build never fails during
// static prerendering (removes an entire class of Vercel build-time failures).
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
