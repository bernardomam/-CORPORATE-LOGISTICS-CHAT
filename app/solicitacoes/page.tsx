"use client";

import { useState } from "react";
import BarraInferior from "../comp/BarraInferior";

type Status = "Pendente" | "Aprovada" | "Rejeitada";
type Pedido = { id: number; funcionario: string; adminEscolhido: string; status: Status };

export default function SolicitacoesPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1, funcionario: "Carlos Almeida", adminEscolhido: "Rafael Lima", status: "Pendente" },
    { id: 2, funcionario: "Ana Costa", adminEscolhido: "Mariana Souza", status: "Pendente" },
    { id: 3, funcionario: "João Pereira", adminEscolhido: "Rafael Lima", status: "Aprovada" },
  ]);

  function decidir(id: number, status: Status) {
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-2xl font-bold text-[#1e2a78]">Solicitações</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Qualquer administrador de TI pode aprovar ou rejeitar.
        </p>

        <ul className="mt-4">
          {pedidos.map((p) => (
            <li key={p.id} className="border-b border-slate-100 py-3">
              <p className="text-[15px] font-bold text-[#1e2a78]">{p.funcionario}</p>
              <p className="text-xs font-medium text-slate-500">
                Admin escolhido: {p.adminEscolhido}
              </p>
              {p.status === "Pendente" ? (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => decidir(p.id, "Aprovada")}
                    className="flex-1 rounded-xl bg-[#3d3fe8] py-2 text-sm font-bold text-white transition active:scale-95"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => decidir(p.id, "Rejeitada")}
                    className="flex-1 rounded-xl border border-slate-300 py-2 text-sm font-bold text-red-600 transition active:scale-95"
                  >
                    Rejeitar
                  </button>
                </div>
              ) : (
                <p className={`mt-1 text-sm font-bold ${p.status === "Aprovada" ? "text-emerald-600" : "text-red-600"}`}>
                  {p.status}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <BarraInferior ativo="Solicitações" />
    </main>
  );
}