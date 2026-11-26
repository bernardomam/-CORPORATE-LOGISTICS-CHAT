
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ChatCliente from "../chat/[id]/ChatCliente";
import BarraInferior from "../comp/BarraInferior";
import { useAuth } from "../contextos/AuthContext";
import { api } from "../lib/api";

type Participante = {
  id: string;
  nome: string;
  foto?: string;
  cargo?: string;
  setor?: string;
  role?: "USER" | "IT_ADMIN";
};

type Membro = {
  userId?: string;
  user?: {
    id: string;
    name: string;
    role: "USER" | "IT_ADMIN";
    avatarUrl?: string | null;
    jobTitle?: string | null;
    department?: {
      name?: string;
    } | null;
  };
};

type ConversaBackend = {
  id: string | number;
  members?: Membro[];
};

type RespostaConversas = {
  sucesso?: boolean;
  mensagem?: string;
  conversas?: ConversaBackend[];
};

type Conversa = {
  id: string;
  participante: Participante;
};

export default function ConversasPage() {
  const { usuario, token } = useAuth();

  const [busca, setBusca] = useState("");
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarConversas = useCallback(async () => {
    if (!token || !usuario?.id) {
      setConversas([]);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const dados = (await api("/api/private-chats", {
        method: "GET",
        token,
      })) as RespostaConversas | ConversaBackend[];

      if (!Array.isArray(dados) && dados?.sucesso === false) {
        throw new Error(
          dados.mensagem || "Não foi possível carregar as conversas."
        );
      }

      const lista = Array.isArray(dados) ? dados : dados.conversas;

      if (!Array.isArray(lista)) {
        throw new Error("O servidor retornou uma resposta inesperada.");
      }

      const conversasFormatadas: Conversa[] = lista
        .map((conversa): Conversa | null => {
          const membros = Array.isArray(conversa.members)
            ? conversa.members
            : [];

          const outroMembro = membros.find(
            (membro) =>
              membro.user?.id &&
              membro.user.id !== usuario.id
          );

          if (!outroMembro?.user) {
            return null;
          }

          return {
            id: String(conversa.id),
            participante: {
  id: outroMembro.user.id,
  nome: outroMembro.user.name,
  foto: outroMembro.user.avatarUrl ?? undefined,
  cargo: outroMembro.user.jobTitle ?? undefined,
  setor: outroMembro.user.department?.name ?? undefined,
  role: outroMembro.user.role,
},
          };
        })
        .filter(
          (conversa): conversa is Conversa =>
            conversa !== null
        );

      setConversas(conversasFormatadas);

      setConversaSelecionada((selecionada) =>
        selecionada &&
        conversasFormatadas.some((c) => c.id === selecionada)
          ? selecionada
          : null
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar as conversas."
      );
    } finally {
      setCarregando(false);
    }
  }, [token, usuario?.id]);

  useEffect(() => {
    carregarConversas();
  }, [carregarConversas]);

  const lista = conversas.filter((conversa) =>
    conversa.participante.nome
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const conversaAtual = conversas.find(
    (conversa) => conversa.id === conversaSelecionada
  );

  return (
    <main className="min-h-screen bg-slate-50 md:pl-56">
      <div className="flex min-h-screen w-full pb-20 md:h-screen md:pb-0">
        <section className="w-full border-r border-slate-200 bg-white md:h-full md:w-[380px] md:shrink-0">
          <header className="border-b border-slate-100 px-5 pb-5 pt-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800">
                  Conversas privadas
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Suas comunicações individuais
                </p>
              </div>

              <button
                type="button"
                onClick={carregarConversas}
                disabled={carregando}
                title="Atualizar conversas"
                aria-label="Atualizar conversas"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
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

            <label className="mt-5 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 transition focus-within:ring-2 focus-within:ring-indigo-200">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar conversas..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
          </header>

          {carregando && conversas.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Carregando conversas...
            </p>
          )}

          {!carregando && erro && conversas.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-red-500">{erro}</p>
              <button
                type="button"
                onClick={carregarConversas}
                className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {erro && conversas.length > 0 && (
            <p className="px-5 py-3 text-center text-xs text-red-500">
              Não foi possível atualizar. Exibindo a última lista carregada.
            </p>
          )}

          {!carregando && !erro && conversas.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Você ainda não possui conversas privadas.
            </p>
          )}

          {conversas.length > 0 && (
            <>
              <ul>
                {lista.map((conversa) => {
                  const nome = conversa.participante.nome;
                  const iniciais = nome
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((parte) => parte.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <li key={conversa.id}>
                      <Link
                        href={`/chat/${encodeURIComponent(conversa.id)}?tipo=privada`}
                        className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 active:bg-indigo-50 md:hidden"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                          {iniciais || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {nome}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            Conversa privada
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setConversaSelecionada(conversa.id)}
                        className={`hidden w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 active:bg-indigo-50 md:flex ${
                          conversaSelecionada === conversa.id
                            ? "bg-indigo-50"
                            : ""
                        }`}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                          {iniciais || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {nome}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            Conversa privada
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {lista.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  Nenhuma conversa encontrada para essa busca.
                </p>
              )}
            </>
          )}
        </section>

        <section className="hidden min-w-0 flex-1 bg-slate-50 md:flex md:h-full">
          {conversaAtual ? (
            <ChatCliente
              id={conversaAtual.id}
              tipoConversa="privada"
              embutido
              onVoltar={() => setConversaSelecionada(null)}
              participantes={[conversaAtual.participante]}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-md px-8 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
                  </svg>
                </div>

                <h2 className="mt-7 text-2xl font-bold text-slate-800">
                  Bem-vindo ao callZUP
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Selecione uma conversa privada ao lado para começar a se comunicar com sua equipe.
                </p>

                <div className="mx-auto mt-7 h-1 w-16 rounded-full bg-indigo-500" />
              </div>
            </div>
          )}
        </section>
      </div>

      <BarraInferior ativo="Conversas" />
    </main>
  );
}
