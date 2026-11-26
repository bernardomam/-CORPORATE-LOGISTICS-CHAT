
"use client";

import { useCallback, useEffect, useState } from "react";
import BarraInferior from "../comp/BarraInferior";
import { useAuth } from "../contextos/AuthContext";
import { api } from "../lib/api";

type Status = "Pendente" | "Aprovada" | "Rejeitada";

type Pedido = {
  id: string;
  funcionario: string;
  adminEscolhido: string;
  status: Status;
};

type RegistroAPI = Record<string, unknown>;

function obterNome(valor: unknown): string {
  if (typeof valor === "string") return valor;

  if (valor && typeof valor === "object") {
    const objeto = valor as Record<string, unknown>;

    if (typeof objeto.name === "string") return objeto.name;
    if (typeof objeto.nome === "string") return objeto.nome;
  }

  return "Não informado";
}

function formatarStatus(valor: unknown): Status {
  const status = String(valor ?? "").toUpperCase();

  if (["APPROVED", "APROVADA", "APROVADO"].includes(status)) {
    return "Aprovada";
  }

  if (["REJECTED", "REJEITADA", "REJEITADO"].includes(status)) {
    return "Rejeitada";
  }

  return "Pendente";
}

function formatarPedido(item: RegistroAPI): Pedido | null {
  const id = item.id;

  if (typeof id !== "string" && typeof id !== "number") {
    return null;
  }

  const solicitante =
    item.user ??
    item.usuario ??
    item.solicitante ??
    item.requester ??
    item.funcionario;

  const administrador =
    item.admin ??
    item.administrador ??
    item.adminEscolhido ??
    item.targetUser;

  return {
    id: String(id),
    funcionario: obterNome(solicitante),
    adminEscolhido: obterNome(administrador),
    status: formatarStatus(item.status),
  };
}

export default function SolicitacoesPage() {
  const { usuario, token } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState<string | null>(null);

  const carregarPedidos = useCallback(async () => {
    if (!token || usuario?.role !== "IT_ADMIN") {
      setPedidos([]);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const dados = await api("/api/chat-requests", {
        method: "GET",
        token,
      });

      if (dados?.sucesso === false) {
        throw new Error(
          dados.mensagem || "Não foi possível carregar as solicitações."
        );
      }

      const lista = Array.isArray(dados)
        ? dados
        : dados?.solicitacoes ??
          dados?.pedidos ??
          dados?.requests ??
          dados?.data;

      if (!Array.isArray(lista)) {
        throw new Error(
          "Formato de resposta das solicitações não reconhecido."
        );
      }

      const formatados = lista
        .map((item: RegistroAPI) => formatarPedido(item))
        .filter((item: Pedido | null): item is Pedido => item !== null);

      setPedidos(formatados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar solicitações."
      );
    } finally {
      setCarregando(false);
    }
  }, [token, usuario?.role]);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  async function decidir(id: string, decisao: "aprovar" | "rejeitar") {
    if (!token || processando) return;

    try {
      setProcessando(id);
      setErro("");

      const resposta = await api(
        `/api/chat-requests/${encodeURIComponent(id)}/${decisao}`,
        {
          method: "PATCH",
          token,
        }
      );

      if (resposta?.sucesso === false) {
        throw new Error(
          resposta.mensagem || "Não foi possível atualizar a solicitação."
        );
      }

      await carregarPedidos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a solicitação."
      );
    } finally {
      setProcessando(null);
    }
  }

  const corStatus = {
    Pendente: "text-amber-600",
    Aprovada: "text-emerald-600",
    Rejeitada: "text-red-600",
  };

  if (usuario?.role !== "IT_ADMIN") {
    return (
      <main className="min-h-screen bg-white pb-24">
        <div className="mx-auto max-w-sm px-5 pt-8">
          <h1 className="text-2xl font-bold text-[#1e2a78]">
            Acesso restrito
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Somente administradores de TI podem consultar solicitações.
          </p>
        </div>

        <BarraInferior ativo="Perfil" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-white">
      <div className="w-full max-w-sm px-5 pb-24 pt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1e2a78]">
              Solicitações
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Aprove ou rejeite pedidos de conversa privada.
            </p>
          </div>

          <button
            type="button"
            onClick={carregarPedidos}
            disabled={carregando}
            aria-label="Atualizar solicitações"
            title="Atualizar solicitações"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={carregando ? "animate-spin" : ""}
            >
              <path d="M20 7v5h-5" />
              <path d="M4 17v-5h5" />
              <path d="M5.6 9a7 7 0 0 1 11.5-2L20 12" />
              <path d="M4 12l2.9 5a7 7 0 0 0 11.5-2" />
            </svg>
          </button>
        </div>

        {erro && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {erro}
          </div>
        )}

        {carregando && pedidos.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            Carregando solicitações...
          </p>
        )}

        {!carregando && pedidos.length === 0 && !erro && (
          <p className="py-10 text-center text-sm text-slate-400">
            Nenhuma solicitação encontrada.
          </p>
        )}

        <ul className="mt-4">
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="border-b border-slate-100 py-4"
            >
              <p className="text-[15px] font-bold text-[#1e2a78]">
                {pedido.funcionario}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Administrador escolhido: {pedido.adminEscolhido}
              </p>

              {pedido.status === "Pendente" ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => decidir(pedido.id, "aprovar")}
                    disabled={processando !== null}
                    className="flex-1 rounded-xl bg-[#3d3fe8] py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {processando === pedido.id ? "Processando..." : "Aprovar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => decidir(pedido.id, "rejeitar")}
                    disabled={processando !== null}
                    className="flex-1 rounded-xl border border-slate-300 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Rejeitar
                  </button>
                </div>
              ) : (
                <p
                  className={`mt-2 text-sm font-bold ${corStatus[pedido.status]}`}
                >
                  {pedido.status}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <BarraInferior ativo="Perfil" />
    </main>
  );
}
