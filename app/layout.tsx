import type { Metadata } from "next";
import "./globals.css";
import GuardaHorario from "./componentes/GuardaHorario";

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
      <body>
        <GuardaHorario />
        {children}
      </body>
    </html>
  );
}