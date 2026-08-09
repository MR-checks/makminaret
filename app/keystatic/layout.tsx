import * as React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keystatic Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
