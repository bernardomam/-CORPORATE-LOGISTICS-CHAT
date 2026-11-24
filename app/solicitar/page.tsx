
"use client";

import { useState } from "react";
import BarraInferior from "../comp/BarraInferior";
import { useAuth } from "../contextos/AuthContext";
import { api } from "../lib/api";

const admins = [
  { id: "", nome: "João Victor (TI)" },
  { id: "", nome: "João Gabriel (TI)" },
];

export default function SolicitarPage() {
  const { token } = useAuth();

  const [escolhido, setEscolhido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function enviar() {
    const admin = admins.find((item) => item.nome === escolhido);

    if (!admin) return;

    if (!admin.id) {
      setErro("O ID deste administrador ainda precisa ser configurado.");
      return;
    }

    if (!token) {
      setErro("Sua sessão expirou. Entre novamente.");
      return;
    }

    try {
      setEnviando(true);
      setErro("");
      setMensagem("");

      await api("/api/chat-requests", {
        method: "POST",
        token,
        body: JSON.stringify({
          adminId: admin.id,
        }),
      });

      setMensagem("Solicitação enviada com sucesso!");
      setEscolhido("");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a solicitação."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-2xl font-bold text-[#1e2a78]">
          Solicitar conversa privada
        </h1>

        <p className="mt-1 text-sm font-medium text-slate-600">
          Escolha um administrador da TI. A solicitação precisa ser aprovada.
        </p>

        <ul className="mt-4 space-y-2">
          {admins.map((admin) => (
            <li key={admin.nome}>
              <button
                onClick={() => {
                  setEscolhido(admin.nome);
                  setErro("");
                  setMensagem("");
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left text-[15px] font-bold transition active:scale-95 ${
                  escolhido === admin.nome
                    ? "border-[#3d3fe8] bg-indigo-50 text-[#3d3fe8]"
                    : "border-slate-200 text-[#1e2a78]"
                }`}
              >
                {admin.nome}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={enviar}
          disabled={!escolhido || enviando}
          className="mt-4 w-full rounded-2xl bg-[#3d3fe8] py-3.5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
        >
          {enviando ? "Enviando..." : "Enviar solicitação"}
        </button>

        {mensagem && (
          <p className="mt-4 text-center text-sm font-medium text-emerald-600">
            {mensagem}
          </p>
        )}

        {erro && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {erro}
          </p>
        )}

        <h2 className="mt-8 text-lg font-bold text-[#1e2a78]">
          Minhas solicitações
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          O histórico ficará disponível quando o backend oferecer uma rota de
          consulta das solicitações do funcionário.
        </p>
      </div>

      <BarraInferior ativo="Solicitar" />
    </main>
  );
}
