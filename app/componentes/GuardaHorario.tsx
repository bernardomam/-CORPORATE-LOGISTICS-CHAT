"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contextos/AuthContext";
import { dentroDoHorario } from "../lib/horario";

export default function GuardaHorario() {
  const pathname = usePathname();
  const router = useRouter();
  const { autenticado, carregandoAuth, usuario, sair } = useAuth();

  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/login") || carregandoAuth) return;
    if (!autenticado) { router.replace("/login"); return; }
    if (pathname.startsWith("/ti") && usuario?.role !== "IT_ADMIN") { router.replace("/conversas"); return; }
    const checar = () => {
      if (!dentroDoHorario()) { sair(); router.replace("/login"); }
    };
    checar();
    const t = setInterval(checar, 15000);
    return () => clearInterval(t);
  }, [pathname, router, autenticado, carregandoAuth, usuario?.role, sair]);

  return null;
}