
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import GuardaHorario from "./componentes/GuardaHorario";
import { AuthProvider } from "./contextos/AuthContext";

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
        <AuthProvider>
          <Suspense fallback={null}>
            <GuardaHorario />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}