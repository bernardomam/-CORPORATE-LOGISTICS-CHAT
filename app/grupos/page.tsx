
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

type Grupo = {
  id: string;
  nome: string;
  participantes: Participante[];
};

type GrupoBackend = {
  id: string | number;
  name?: string;
  nome?: string;
  status?: string;
  members?: {
    userId?: string;
    leftAt?: string | null;
    user?: {
      id?: string;
      name?: string;
      role?: "USER" | "IT_ADMIN";
      avatarUrl?: string | null;
      jobTitle?: string | null;
      department?: {
        name?: string;
      } | null;
    };
  }[];
};

export default function GruposPage() {
  const { usuario, token } = useAuth();
  const isAdmin = usuario?.role === "IT_ADMIN";

  const [busca, setBusca] = useState("");
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState("");

  const carregarGrupos = useCallback(async () => {
    if (!token) {
      setCarregando(false);
      setAviso("Sessão não encontrada. Entre novamente na sua conta.");
      return;
    }

    try {
      setAviso("");

      const dados = await api(isAdmin ? "/api/groups" : "/api/my-groups", {
        method: "GET",
        token,
      });

      if (dados?.sucesso === false) {
        throw new Error(
          dados.mensagem || "Não foi possível carregar os grupos."
        );
      }

      const lista = Array.isArray(dados)
        ? dados
        : dados?.grupos ?? dados?.groups ?? dados?.data;

      if (!Array.isArray(lista)) {
        throw new Error("Formato de grupos retornado pelo servidor inválido.");
      }

      const gruposFormatados: Grupo[] = lista.filter((grupo: GrupoBackend) => !grupo.status || grupo.status === "ACTIVE").map((grupo: GrupoBackend) => ({
        id: String(grupo.id),
        nome: grupo.name ?? grupo.nome ?? "Grupo",
        participantes: (grupo.members ?? [])
          .filter((membro) => !membro.leftAt && membro.user)
          .map((membro) => ({
            id: String(membro.user?.id ?? membro.userId ?? ""),
            nome: membro.user?.name ?? "Usuário",
            foto: membro.user?.avatarUrl ?? undefined,
            cargo: membro.user?.jobTitle ?? undefined,
            setor: membro.user?.department?.name ?? undefined,
            role: membro.user?.role,
          })),
      }));

      setGrupos(gruposFormatados);
    } catch (error) {
      setAviso(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os grupos."
      );
    } finally {
      setCarregando(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    carregarGrupos();
  }, [carregarGrupos]);

  const lista = grupos.filter((grupo) =>
    grupo.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const grupoAtual = grupos.find(
    (grupo) => grupo.id === grupoSelecionado
  );

  return (
    <main className="min-h-screen bg-slate-50 md:pl-56">
      <div className="flex min-h-screen w-full pb-20 md:h-screen md:pb-0">
        <section className="w-full border-r border-slate-200 bg-white md:h-full md:w-[380px] md:shrink-0">
          <header className="border-b border-slate-100 px-5 pb-5 pt-7">
            <h1 className="text-2xl font-extrabold text-slate-800">
              Grupos
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {isAdmin ? "Todos os grupos ativos da empresa" : "Seus grupos de comunicação"}
            </p>

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
                placeholder="Buscar grupos..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
          </header>

          {carregando && (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              Carregando grupos...
            </p>
          )}

          {!carregando && aviso && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-red-500">{aviso}</p>

              <button
                type="button"
                onClick={carregarGrupos}
                className="mt-3 text-sm font-bold text-indigo-600"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !aviso && (
            <>
              <ul>
                {lista.map((grupo) => (
                  <li key={grupo.id}>
                    <Link
                      href={`/chat/${grupo.id}?tipo=grupo`}
                      className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 active:bg-indigo-50 md:hidden"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-bold text-white">
                        {grupo.nome.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {grupo.nome}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {grupo.participantes.length} participantes{isAdmin && !grupo.participantes.some(p => p.id === usuario?.id) ? " · Somente consulta" : ""}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setGrupoSelecionado(grupo.id)}
                      className={`hidden w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 active:bg-indigo-50 md:flex ${
                        grupoSelecionado === grupo.id ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-bold text-white">
                        {grupo.nome.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {grupo.nome}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {grupo.participantes.length} participantes{isAdmin && !grupo.participantes.some(p => p.id === usuario?.id) ? " · Somente consulta" : ""}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {lista.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  {grupos.length === 0
                    ? (isAdmin ? "Nenhum grupo ativo na empresa." : "Você ainda não participa de nenhum grupo.")
                    : "Nenhum grupo encontrado."}
                </p>
              )}
            </>
          )}
        </section>

        <section className="hidden min-w-0 flex-1 bg-slate-50 md:flex md:h-full">
          {grupoAtual ? (
            <ChatCliente
              id={grupoAtual.id}
              tipoConversa="grupo"
              embutido
              onVoltar={() => setGrupoSelecionado(null)}
              adminParticipa={grupoAtual.participantes.some(
                (participante) => participante.id === usuario?.id
              )}
              participantes={grupoAtual.participantes}
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <h2 className="mt-7 text-2xl font-bold text-slate-800">
                  Seus grupos no callZUP
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Selecione um grupo ao lado para acompanhar as conversas da sua equipe.
                </p>

                <div className="mx-auto mt-7 h-1 w-16 rounded-full bg-indigo-500" />
              </div>
            </div>
          )}
        </section>
      </div>

      <BarraInferior ativo="Grupos" />
    </main>
  );
}
