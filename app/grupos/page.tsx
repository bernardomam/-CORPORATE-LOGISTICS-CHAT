"use client";

import { useState } from "react";
import BarraInferior from "../comp/BarraInferior";

const grupos = ["Equipe Logística", "Suporte", "Marketing", "Geral"];

export default function GruposPage() {
  const [aviso, setAviso] = useState("");

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-3xl font-bold text-[#1e2a78]">Grupos</h1>
        <ul className="mt-4">
          {grupos.map((g) => (
            <li key={g} className="flex items-center gap-3 border-b border-slate-100 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
                {g.charAt(0)}
              </div>
              <p className="text-[16px] font-bold text-[#1e2a78]">{g}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setAviso("Pedido enviado à equipe de TI.")}
          className="mt-5 w-full rounded-2xl border border-slate-300 py-3 text-sm font-bold text-[#1e2a78] transition active:scale-95"
        >
          Solicitar novo grupo (diretores)
        </button>
        {aviso ? <p className="mt-3 text-center text-xs font-semibold text-emerald-600">{aviso}</p> : null}
      </div>
      <BarraInferior ativo="Grupos" />
    </main>
  );
}