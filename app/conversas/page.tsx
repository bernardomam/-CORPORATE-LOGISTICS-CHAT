"use client";

import { useState } from "react";
import Link from "next/link";
import BarraInferior from "../comp/BarraInferior";

type Conversa = {
  id: number;
  nome: string;
  mensagem: string;
  hora: string;
  naoLidas?: number;
  tipo: "direta" | "grupo";
  cor: string;
};

const conversas: Conversa[] = [
  { id: 1, nome: "Equipe Logística", mensagem: "Carlos: Já atualizei o status do pedido.", hora: "09:42", naoLidas: 3, tipo: "grupo", cor: "bg-sky-500" },
  { id: 2, nome: "Ana Costa", mensagem: "Você: Ótimo! Obrigado!", hora: "09:28", naoLidas: 1, tipo: "direta", cor: "bg-rose-400" },
  { id: 3, nome: "Projetos", mensagem: "Lucas: Reunião às 15h.", hora: "Ontem", tipo: "direta", cor: "bg-amber-500" },
  { id: 4, nome: "Suporte", mensagem: "Mariana: Verificando o chamado.", hora: "Ontem", tipo: "grupo", cor: "bg-indigo-500" },
  { id: 5, nome: "Marketing", mensagem: "João: Material pronto para revisão.", hora: "Sex", tipo: "grupo", cor: "bg-emerald-500" },
  { id: 6, nome: "Geral", mensagem: "Carlos: Bem-vindos ao callZUP!", hora: "Qui", tipo: "grupo", cor: "bg-slate-500" },
];

const filtros = ["Todas", "Diretas", "Grupos"] as const;

export default function ConversasPage() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Todas");
  const [busca, setBusca] = useState("");

  const lista = conversas.filter((c) => {
    const okFiltro =
      filtro === "Todas" ||
      (filtro === "Diretas" && c.tipo === "direta") ||
      (filtro === "Grupos" && c.tipo === "grupo");
    const okBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    return okFiltro && okBusca;
  });

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-sm pb-24">
        <header className="px-5 pt-8 pb-3">
          <h1 className="text-3xl tracking-tight">
            <span className="font-semibold text-[#1e2a78]">call</span>
            <span className="font-extrabold text-[#3b3fe0]">ZUP</span>
          </h1>

          <label className="mt-4 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full bg-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-500 outline-none"
            />
          </label>

          <div className="mt-3 flex gap-2">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`flex-1 rounded-full py-2 text-sm font-bold transition active:scale-95 ${
                  filtro === f
                    ? "bg-[#3d3fe8] text-white"
                    : "bg-slate-100 text-[#1e2a78]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

                <ul>
          {lista.map((c) => (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 px-5 py-3 transition active:bg-slate-50"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${c.cor}`}
                >
                  {c.nome.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-bold text-[#1e2a78]">
                    {c.nome}
                  </p>
                  <p className="truncate text-[14px] font-medium text-slate-600">
                    {c.mensagem}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[13px] font-semibold text-slate-500">
                    {c.hora}
                  </span>
                  {c.naoLidas ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3d3fe8] px-1.5 text-xs font-bold text-white">
                      {c.naoLidas}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <BarraInferior ativo="Conversas" />
    </main>
  );
}