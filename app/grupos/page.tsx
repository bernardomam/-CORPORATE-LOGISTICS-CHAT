
"use client";

import Link from "next/link";
import BarraInferior from "../comp/BarraInferior";

const grupos = [
  { id: 1, nome: "Equipe Logística" },
  { id: 4, nome: "Suporte" },
  { id: 5, nome: "Marketing" },
  { id: 6, nome: "Geral" },
];

export default function GruposPage() {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-3xl font-bold text-[#1e2a78]">
          Grupos
        </h1>

        <ul className="mt-4">
          {grupos.map((grupo) => (
            <li key={grupo.id}>
              <Link
                href={`/chat/${grupo.id}`}
                className="flex items-center gap-3 border-b border-slate-100 py-3 transition active:bg-slate-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
                  {grupo.nome.charAt(0)}
                </div>

                <p className="text-[16px] font-bold text-[#1e2a78]">
                  {grupo.nome}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <BarraInferior ativo="Grupos" />
    </main>
  );
}
