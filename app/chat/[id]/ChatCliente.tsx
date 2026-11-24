
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { dentroDoHorario } from "../../lib/horario";
import { useAuth } from "../../contextos/AuthContext";
import { api } from "../../lib/api";

type Status = "enviada" | "entregue" | "lida";

type Participante = {
  id: string;
  nome: string;
  foto?: string;
  cargo?: string;
  setor?: string;
  role?: "USER" | "IT_ADMIN";
};

type Msg = {
  id: string;
  minha: boolean;
  texto?: string;
  arquivo?: {
    nome: string;
    tamanho: string;
    tipo: "pdf" | "imagem";
    url?: string;
  };
  hora: string;
  status?: Status;
  respostaA: string | null;
  reacoes: string[];
};

type MensagemBackend = {
  id: string;
  content?: string;
  text?: string;
  senderId?: string;
  userId?: string;
  sender?: { id?: string };
  user?: { id?: string };
  createdAt?: string;
  created_at?: string;
  sentAt?: string;
  replyToId?: string | null;
  reactions?: Array<string | { emoji?: string }>;
};

const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

function Ticks({ status }: { status?: Status }) {
  if (!status) return null;

  const cor = status === "lida" ? "text-sky-300" : "text-white/70";

  return (
    <span className={`ml-1 text-[11px] ${cor}`}>
      {status === "enviada" ? "✓" : "✓✓"}
    </span>
  );
}

function CartaoPerfil({
  participante,
}: {
  participante: Participante;
}) {
  const nome = participante.nome || "Nome do funcionário";

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");

  const tipoConta =
    participante.role === "IT_ADMIN"
      ? "Administrador de TI"
      : participante.role === "USER"
        ? "Usuário"
        : "Não informado";

  return (
    <div className="p-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {participante.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={participante.foto}
              alt={`Foto de ${nome}`}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
              {iniciais || "U"}
            </div>
          )}

          <h3 className="mt-4 text-xl font-bold text-slate-800">
            {nome}
          </h3>

          <span className="mt-4 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
            {tipoConta}
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800">
          Informações profissionais
        </h3>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cargo
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {participante.cargo || "Não informado"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Setor
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {participante.setor || "Não informado"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tipo de conta
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {participante.role || "Não informado"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ChatCliente({
  id,
  tipoConversa = "privada",
  embutido = false,
  onVoltar,
  adminParticipa = false,
  participantes = [],
}: {
  id: string;
  tipoConversa?: "privada" | "grupo";
  embutido?: boolean;
  onVoltar?: () => void;
  adminParticipa?: boolean;
  participantes?: Participante[];
}) {
  const { usuario, token } = useAuth();

  const isAdminTI = usuario?.role === "IT_ADMIN";

const somenteLeitura =
  isAdminTI &&
  tipoConversa === "grupo" &&
  !adminParticipa;

  const contato = participantes[0] ?? null;

  const nome =
  tipoConversa === "privada"
    ? contato?.nome ?? "Conversa privada"
    : "Grupo";

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [carregandoMensagens, setCarregandoMensagens] = useState(true);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const [respondendo, setRespondendo] = useState<Msg | null>(null);
  const [reacaoAberta, setReacaoAberta] = useState<string | null>(null);
  const [informacoesAbertas, setInformacoesAbertas] = useState(false);
  const [participanteSelecionado, setParticipanteSelecionado] =
    useState<Participante | null>(null);
  const [enviando, setEnviando] = useState(false);

  const arquivoRef = useRef<HTMLInputElement>(null);

  const horarioPermitido = dentroDoHorario();

  const carregarMensagens = useCallback(async () => {
    if (!token) {
      setCarregandoMensagens(false);
      setAviso("Sessão não encontrada. Entre novamente na sua conta.");
      return;
    }

    try {
      setAviso("");

      const rota =
        tipoConversa === "grupo"
          ? `/api/group-messages/${id}`
          : `/api/private-chats/${id}/messages`;

      const dados = await api(rota, {
        method: "GET",
        token,
      });

      if (dados?.sucesso === false) {
        throw new Error(
          dados.mensagem || "Não foi possível carregar as mensagens."
        );
      }

      const lista = Array.isArray(dados)
        ? dados
        : dados?.mensagens ?? dados?.messages ?? dados?.data;

      if (!Array.isArray(lista)) {
        throw new Error("Formato de mensagens retornado pelo servidor inválido.");
      }

      const formatadas: Msg[] = lista.map(
        (mensagem: MensagemBackend) => {
          const remetenteId =
            mensagem.senderId ??
            mensagem.userId ??
            mensagem.sender?.id ??
            mensagem.user?.id;

          const dataMensagem =
            mensagem.createdAt ??
            mensagem.created_at ??
            mensagem.sentAt;

          return {
            id: String(mensagem.id),
            minha: String(remetenteId) === String(usuario?.id),
            texto: mensagem.content ?? mensagem.text ?? "",
            hora: dataMensagem
              ? new Intl.DateTimeFormat("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(dataMensagem))
              : "--:--",
            respostaA: mensagem.replyToId
              ? String(mensagem.replyToId)
              : null,
            reacoes: Array.isArray(mensagem.reactions)
              ? mensagem.reactions
                  .map((reacao) =>
                    typeof reacao === "string" ? reacao : reacao.emoji
                  )
                  .filter((emoji): emoji is string => Boolean(emoji))
              : [],
          };
        }
      );

      setMsgs(formatadas);
    } catch (error) {
      setAviso(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as mensagens."
      );
    } finally {
      setCarregandoMensagens(false);
    }
  }, [id, tipoConversa, token, usuario?.id]);

  useEffect(() => {
    setMsgs([]);
    setCarregandoMensagens(true);
    carregarMensagens();
  }, [carregarMensagens]);

  function abrirInformacoes() {
    setParticipanteSelecionado(
      tipoConversa === "privada" ? contato : null
    );
    setInformacoesAbertas(true);
  }

  function textoDaMensagem(msg: Msg) {
    if (msg.texto) return msg.texto;
    if (msg.arquivo) return `📎 ${msg.arquivo.nome}`;
    return "Mensagem";
  }

  async function enviarTexto() {
    if (somenteLeitura || enviando || !token) return;

    const conteudo = texto.trim();

    if (!conteudo) return;

    if (!dentroDoHorario()) {
      setAviso("Fora do horário de uso (8h às 18h). Não é possível enviar.");
      return;
    }

    try {
      setEnviando(true);
      setAviso("");

      const rota =
        tipoConversa === "grupo"
          ? `/api/group-messages/${id}`
          : `/api/private-chats/${id}/messages`;

      await api(rota, {
        method: "POST",
        token,
        body: JSON.stringify({
          content: conteudo,
          ...(respondendo ? { replyToId: respondendo.id } : {}),
        }),
      });

      setTexto("");
      setRespondendo(null);

      await carregarMensagens();
    } catch (error) {
      setAviso(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a mensagem."
      );
    } finally {
      setEnviando(false);
    }
  }

  function escolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    if (somenteLeitura) return;

    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    setAviso(
      "O envio de arquivos ainda depende da implementação da rota de upload no servidor."
    );

    e.target.value = "";
  }

  async function reagir(msgId: string, emoji: string) {
    if (somenteLeitura || !token) return;

    const mensagem = msgs.find((m) => m.id === msgId);

    if (!mensagem) return;

    const remover = mensagem.reacoes.includes(emoji);

    const rota =
      tipoConversa === "grupo"
        ? `/api/group-messages/${id}/messages/${msgId}/reactions`
        : `/api/private-chats/${id}/messages/${msgId}/reactions`;

    try {
      setAviso("");

      await api(rota, {
        method: remover ? "DELETE" : "POST",
        token,
        body: JSON.stringify({ emoji }),
      });

      await carregarMensagens();
    } catch (error) {
      setAviso(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a reação."
      );
    }
  }

  function iniciarResposta(msg: Msg) {
    if (somenteLeitura) return;

    setRespondendo(msg);
    setAviso("");
  }

  return (
    <main
      className={
        embutido
          ? "relative flex h-full min-h-0 w-full bg-slate-100"
          : "flex min-h-screen bg-slate-100 md:pl-56"
      }
    >
      <div
        className={`flex w-full min-w-0 flex-col ${
          embutido ? "relative h-full min-h-0" : "min-h-screen"
        }`}
      >
        <header className="flex shrink-0 items-center gap-3 bg-[#0e1f7a] px-4 py-4 text-white">
          {!embutido && (
            <Link
              href={tipoConversa === "grupo" ? "/grupos" : "/conversas"}
              aria-label="Voltar"
              className="text-xl font-bold"
            >
              ←
            </Link>
          )}

          <button
            type="button"
            onClick={abrirInformacoes}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            {tipoConversa === "privada" && contato?.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={contato.foto}
                alt={nome}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-bold">
                {nome.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-base font-bold leading-tight">
                {nome}
              </p>
              <p className="text-xs font-medium text-emerald-300">
                {tipoConversa === "grupo"
                  ? `${participantes.length} participantes`
                  : "Conversa privada"}
              </p>
            </div>
          </button>
        </header>

        {informacoesAbertas && (
          <div
            className="absolute inset-0 z-50 flex justify-end bg-black/30"
            onClick={() => setInformacoesAbertas(false)}
          >
            <div
              className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-slate-50 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex shrink-0 items-center justify-between bg-[#0e1f7a] px-5 py-4 text-white">
                <div className="flex items-center gap-2">
                  {participanteSelecionado && tipoConversa === "grupo" && (
                    <button
                      type="button"
                      onClick={() => setParticipanteSelecionado(null)}
                      className="text-xl"
                      aria-label="Voltar às informações do grupo"
                    >
                      ←
                    </button>
                  )}

                  <h2 className="font-bold">
                    {participanteSelecionado
                      ? "Perfil do funcionário"
                      : tipoConversa === "grupo"
                        ? "Informações do grupo"
                        : "Perfil do contato"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setInformacoesAbertas(false)}
                  className="text-2xl"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </header>

              {participanteSelecionado ? (
                <div className="flex-1 overflow-y-auto">
                  <CartaoPerfil participante={participanteSelecionado} />
                </div>
              ) : tipoConversa === "grupo" ? (
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500 text-3xl font-bold text-white">
                      {nome.charAt(0)}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                      {nome}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {participantes.length} participantes
                    </p>
                  </div>

                  <h3 className="mb-3 mt-5 font-bold text-slate-700">
                    Participantes
                  </h3>

                  <div className="space-y-2">
                    {participantes.map((participante) => (
                      <button
                        key={participante.id}
                        type="button"
                        onClick={() =>
                          setParticipanteSelecionado(participante)
                        }
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-100"
                      >
                        {participante.foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={participante.foto}
                            alt={participante.nome}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                            {participante.nome.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-700">
                            {participante.nome}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {participante.cargo || "Cargo não informado"}
                          </p>
                        </div>

                        <span className="ml-auto text-slate-400">›</span>
                      </button>
                    ))}

                    {participantes.length === 0 && (
                      <p className="text-sm text-slate-500">
                        Nenhum participante disponível.
                      </p>
                    )}
                  </div>
                </div>
              ) : contato ? (
                <div className="flex-1 overflow-y-auto">
                  <CartaoPerfil participante={contato} />
                </div>
              ) : (
                <div className="p-6 text-sm text-slate-500">
                  Não há informações disponíveis para este contato.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-4 pb-36">
          {carregandoMensagens && (
            <p className="py-6 text-center text-sm text-slate-400">
              Carregando mensagens...
            </p>
          )}

          {!carregandoMensagens && msgs.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              Nenhuma mensagem nesta conversa.
            </p>
          )}

          {msgs.map((m) => {
            const mensagemRespondida = msgs.find(
              (mensagem) => mensagem.id === m.respostaA
            );

            return (
              <div
                key={m.id}
                className={`flex w-full min-w-0 ${
                  m.minha ? "justify-end" : "justify-start"
                }`}
              >
                <div className="relative min-w-0 max-w-[85%] md:max-w-[70%]">
                  <div
                    className={`break-words rounded-2xl px-3.5 py-2.5 text-[15px] font-medium shadow-sm ${
                      m.minha
                        ? "rounded-br-sm bg-[#3d3fe8] text-white"
                        : "rounded-bl-sm bg-white text-slate-800"
                    }`}
                  >
                    {mensagemRespondida && (
                      <div className="mb-2 rounded-lg border-l-4 border-sky-400 bg-black/10 px-2 py-1.5">
                        <p className="text-[11px] font-bold">
                          Respondendo mensagem
                        </p>
                        <p className="truncate text-xs opacity-80">
                          {textoDaMensagem(mensagemRespondida)}
                        </p>
                      </div>
                    )}

                    {m.texto && <p>{m.texto}</p>}

                    {m.arquivo && (
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-10 w-9 shrink-0 items-center justify-center rounded bg-red-500 text-[10px] font-bold text-white">
                          PDF
                        </div>

                        <div className="min-w-0">
                          <p className="break-all text-sm font-bold">
                            {m.arquivo.nome}
                          </p>
                          <p className="text-xs opacity-70">
                            {m.arquivo.tamanho}
                          </p>
                        </div>
                      </div>
                    )}

                    <p
                      className={`mt-1 text-right text-[11px] ${
                        m.minha ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {m.hora}
                      {m.minha && <Ticks status={m.status} />}
                    </p>
                  </div>

                  {m.reacoes.length > 0 && (
                    <div className="mt-1 flex max-w-full flex-wrap gap-1">
                      {m.reacoes.map((emoji, indice) => (
                        <button
                          key={`${emoji}-${indice}`}
                          type="button"
                          disabled={somenteLeitura}
                          onClick={() => reagir(m.id, emoji)}
                          className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm disabled:cursor-default"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {!somenteLeitura && (
                    <div className="mt-1 flex items-center gap-3 px-1">
                      <button
                        type="button"
                        onClick={() => iniciarResposta(m)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-[#3d3fe8]"
                      >
                        Responder
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          title="Reagir à mensagem"
                          aria-label="Reagir à mensagem"
                          onClick={() =>
                            setReacaoAberta(
                              reacaoAberta === m.id ? null : m.id
                            )
                          }
                          className="text-sm text-slate-500 transition hover:scale-110"
                        >
                          😊
                        </button>

                        {reacaoAberta === m.id && (
                          <div
                            className={`absolute bottom-7 z-20 flex max-w-[calc(100vw-2rem)] gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-lg ${
                              m.minha ? "right-0" : "left-0"
                            }`}
                          >
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                title={`Reagir com ${emoji}`}
                                onClick={() => {
                                  reagir(m.id, emoji);
                                  setReacaoAberta(null);
                                }}
                                className="shrink-0 text-lg transition hover:scale-125"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!somenteLeitura && (
          <div
            className={`${
              embutido
                ? "absolute bottom-0 left-0 w-full"
                : "fixed bottom-0 left-0 w-full md:left-56 md:w-[calc(100%-14rem)]"
            } z-30 border-t border-slate-200 bg-white px-3 py-3`}
          >
            {!horarioPermitido && (
              <p className="mb-2 text-center text-xs font-semibold text-red-600">
                Fora do horário de uso (8h às 18h).
              </p>
            )}

            {aviso && (
              <p className="mb-2 text-center text-xs font-semibold text-red-600">
                {aviso}
              </p>
            )}

            {respondendo && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#3d3fe8]">
                    Respondendo mensagem
                  </p>
                  <p className="truncate text-xs text-slate-600">
                    {textoDaMensagem(respondendo)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRespondendo(null)}
                  className="ml-2 text-lg font-bold text-slate-500"
                  aria-label="Cancelar resposta"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex min-w-0 items-center gap-2">
              <input
                ref={arquivoRef}
                type="file"
                accept="application/pdf,image/jpeg"
                onChange={escolherArquivo}
                className="hidden"
              />

              <button
                type="button"
                disabled={!horarioPermitido}
                onClick={() => arquivoRef.current?.click()}
                aria-label="Anexar PDF ou JPEG"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-[#1e2a78] transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                📎
              </button>

              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarTexto()}
                disabled={!horarioPermitido || enviando}
                placeholder={
                  horarioPermitido
                    ? "Digite uma mensagem..."
                    : "Envio indisponível"
                }
                className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-[15px] font-medium text-slate-900 placeholder:text-slate-500 outline-none disabled:opacity-50"
              />

              <button
                type="button"
                onClick={enviarTexto}
                disabled={!horarioPermitido || !texto.trim() || enviando}
                aria-label="Enviar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3d3fe8] text-lg text-white transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
