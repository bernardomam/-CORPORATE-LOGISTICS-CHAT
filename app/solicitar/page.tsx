
"use client";

import { useEffect, useState } from "react";
import BarraInferior from "../comp/BarraInferior";
import { useAuth } from "../contextos/AuthContext";
import { api } from "../lib/api";

type Admin = { id: string; name: string; role: string };
type Solicitacao = { id: string; status: string; requester?: { name: string }; requestedUser?: { name: string } };

export default function SolicitarPage() {
  const { token } = useAuth();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroHistorico, setErroHistorico] = useState("");
  const [escolhido, setEscolhido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelado = false;
    setCarregando(true);
    setAdmins([]);
    setEscolhido("");
    setSolicitacoes([]);
    void api("/api/users/colegas", { method: "GET", token }).then(dados => {
      if (cancelado) return;
      if (!Array.isArray(dados?.usuarios)) throw new Error("Lista de administradores inválida.");
      setAdmins(dados.usuarios.filter((u: Admin) => u.role === "IT_ADMIN"));
    }).catch(error => {
      if (!cancelado) setErro(error instanceof Error ? error.message : "Não foi possível carregar os administradores.");
    }).finally(() => { if (!cancelado) setCarregando(false); });
    void api("/api/chat-requests/minhas", { method: "GET", token }).then(dados => {
      if (!cancelado && Array.isArray(dados?.solicitacoes)) setSolicitacoes(dados.solicitacoes);
    }).catch(() => { if (!cancelado) setErroHistorico("Não foi possível carregar o histórico."); });
    return () => { cancelado = true; };
  }, [token]);

  async function enviar() {
    const admin = admins.find((item) => item.id === escolhido);

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

      const resultado = await api("/api/chat-requests", {
        method: "POST",
        token,
        body: JSON.stringify({
          requestedUserId: admin.id,
        }),
      });

      if (resultado?.solicitacao) setSolicitacoes(anteriores => [resultado.solicitacao, ...anteriores]);
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

        {carregando && <p className="mt-4 text-sm text-slate-500">Carregando administradores...</p>}
        {!carregando && admins.length === 0 && <p className="mt-4 text-sm text-slate-500">Nenhum administrador disponível.</p>}
        <ul className="mt-4 space-y-2">
          {admins.map((admin) => (
            <li key={admin.id}>
              <button
                onClick={() => {
                  setEscolhido(admin.id);
                  setErro("");
                  setMensagem("");
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left text-[15px] font-bold transition active:scale-95 ${
                  escolhido === admin.id
                    ? "border-[#3d3fe8] bg-indigo-50 text-[#3d3fe8]"
                    : "border-slate-200 text-[#1e2a78]"
                }`}
              >
                {admin.name}
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

        {erroHistorico && <p className="mt-2 text-sm text-red-600">{erroHistorico}</p>}
        {!erroHistorico && solicitacoes.length === 0 && <p className="mt-2 text-sm text-slate-500">Nenhuma solicitação registrada.</p>}
        <ul className="mt-2 space-y-2">
          {solicitacoes.map(item => (
            <li key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm">
              <p>{item.requester?.name} → {item.requestedUser?.name}</p>
              <p className="font-semibold">{({PENDING: "Pendente", APPROVED: "Aprovada", REJECTED: "Rejeitada"} as Record<string,string>)[item.status] || item.status}</p>
            </li>
          ))}
        </ul>
      </div>

      <BarraInferior ativo="Solicitar" />
    </main>
  );
}
