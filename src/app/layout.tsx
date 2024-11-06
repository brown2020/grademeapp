import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/components/ClientProvider";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";

export const metadata: Metadata = {
  title: "Grade.me",
  description: "Let AI grade your papers and help you improve your work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=contain user-scalable=no maximum-scale=1"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ClientProvider>
          <div className="flex flex-col h-full relative">
            <Header />
            <div className="flex flex-col h-container-small md:h-container-custom overflow-y-scroll">
              <div className="flex flex-col h-full flex-1">{children}</div>
            </div>
            <BottomBar />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
