"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dentroDoHorario } from "../lib/horario";

export default function GuardaHorario() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/login")) return;
    const checar = () => {
      if (!dentroDoHorario()) router.replace("/login");
    };
    checar();
    const t = setInterval(checar, 15000);
    return () => clearInterval(t);
  }, [pathname, router]);

  return null;
}