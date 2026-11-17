"use client";

import { useState } from "react";
import BarraInferior from "../comp/BarraInferior";

type Pedido = { id: number; admin: string; status: "Pendente" | "Aprovada" | "Rejeitada" };

const admins = ["Joao Victor (TI)", "Joao Gabriel (TI)"];

export default function SolicitarPage() {
  const [escolhido, setEscolhido] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1, admin: "Joao Victor (TI)", status: "Aprovada" },
  ]);

  function enviar() {
    if (!escolhido) return;
    setPedidos([{ id: Date.now(), admin: escolhido, status: "Pendente" }, ...pedidos]);
    setEscolhido("");
  }

  const cor = {
    Pendente: "text-amber-600",
    Aprovada: "text-emerald-600",
    Rejeitada: "text-red-600",
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-2xl font-bold text-[#1e2a78]">Solicitar conversa privada</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Escolha um administrador da TI. A solicitação precisa ser aprovada.
        </p>

        <ul className="mt-4 space-y-2">
          {admins.map((a) => (
            <li key={a}>
              <button
                onClick={() => setEscolhido(a)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-[15px] font-bold transition active:scale-95 ${
                  escolhido === a
                    ? "border-[#3d3fe8] bg-indigo-50 text-[#3d3fe8]"
                    : "border-slate-200 text-[#1e2a78]"
                }`}
              >
                {a}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={enviar}
          disabled={!escolhido}
          className="mt-4 w-full rounded-2xl bg-[#3d3fe8] py-3.5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
        >
          Enviar solicitação
        </button>

        <h2 className="mt-8 text-lg font-bold text-[#1e2a78]">Minhas solicitações</h2>
        <ul className="mt-2">
          {pedidos.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-b border-slate-100 py-3">
              <p className="text-[15px] font-bold text-[#1e2a78]">{p.admin}</p>
              <p className={`text-sm font-bold ${cor[p.status]}`}>{p.status}</p>
            </li>
          ))}
        </ul>
      </div>
      <BarraInferior ativo="Solicitar" />
    </main>
  );
}