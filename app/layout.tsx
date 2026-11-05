import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "callZUP",
  description: "Comunicação simples, segura e eficiente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" translate="no">
      <body>{children}</body>
    </html>
  );
}