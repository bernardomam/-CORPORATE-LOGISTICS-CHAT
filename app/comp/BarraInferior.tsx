"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../contextos/AuthContext";

type Perfil = "USER" | "IT_ADMIN";

const icones: Record<string, React.ReactNode> = {
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  grupo: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14c2.7 0 4.5 1.8 4.5 4.5" />
    </>
  ),
  pessoa: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  painel: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  pedido: (
    <>
      <path d="M4 4h16v12H8l-4 4z" />
      <path d="M12 8v4M10 10h4" />
    </>
  ),
};

const menus: Record<Perfil, { nome: string; href: string; icone: string }[]> = {
  USER: [
    { nome: "Conversas", href: "/conversas", icone: "chat" },
    { nome: "Grupos", href: "/grupos", icone: "grupo" },
    { nome: "Solicitar", href: "/solicitar", icone: "pedido" },
    { nome: "Perfil", href: "/perfil", icone: "pessoa" },
  ],
  IT_ADMIN: [
    { nome: "Painel", href: "/ti", icone: "painel" },
    { nome: "Conversas", href: "/conversas", icone: "chat" },
    { nome: "Solicitações", href: "/solicitacoes", icone: "pedido" },
    { nome: "Perfil", href: "/perfil", icone: "pessoa" },
  ],
};

export default function BarraInferior({ ativo }: { ativo: string }) {
  const { usuario } = useAuth();
  const [perfilTeste, setPerfilTeste] = useState<Perfil | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    try {
      const salvo = localStorage.getItem("callzup_perfil");
      if (salvo === "USER" || salvo === "IT_ADMIN") {
        setPerfilTeste(salvo);
      }
    } catch {}
  }, []);

  const perfil: Perfil =
    process.env.NODE_ENV === "development" && perfilTeste
      ? perfilTeste
      : usuario?.role ?? "USER";

  function alternar() {
    const novo: Perfil = perfil === "USER" ? "IT_ADMIN" : "USER";
    setPerfilTeste(novo);

    try {
      localStorage.setItem("callzup_perfil", novo);
    } catch {}
  }

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={alternar}
          className="fixed right-2 top-2 z-50 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-white opacity-80"
        >
          Teste: {perfil}
        </button>
      )}

      <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-slate-200 bg-white py-2 md:bottom-0 md:top-0 md:w-56 md:flex-col md:justify-start md:gap-2 md:border-r md:border-t-0 md:px-3 md:py-6">
        <p className="hidden px-3 pb-4 text-2xl md:block">
          <span className="font-semibold text-[#1e2a78]">call</span>
          <span className="font-extrabold text-[#3b3fe0]">ZUP</span>
        </p>

        {menus[perfil].map((item) => (
          <Link
            key={item.nome}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition active:scale-90 md:flex-row md:gap-3 md:rounded-xl md:px-3 md:py-2.5 ${
              item.nome === ativo
                ? "text-[#3d3fe8] md:bg-indigo-50"
                : "text-slate-400"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icones[item.icone]}
            </svg>

            <span className="text-xs font-bold md:text-sm">
              {item.nome}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}