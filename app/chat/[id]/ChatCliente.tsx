
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { dentroDoHorario } from "../../lib/horario";

type Status = "enviada" | "entregue" | "lida";

type Msg = {
  id: number;
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
  respostaA: number | null;
  reacoes: string[];
};

const nomes: Record<string, string> = {
  "1": "Equipe Logística",
  "2": "Ana Costa",
  "3": "Projetos",
  "4": "Suporte",
  "5": "Marketing",
  "6": "Geral",
};

const inicial: Msg[] = [
  {
    id: 1,
    minha: false,
    texto: "Bom dia! Você conseguiu verificar o status do pedido?",
    hora: "09:16",
    respostaA: null,
    reacoes: [],
  },
  {
    id: 2,
    minha: true,
    texto: "Sim! Já atualizei no sistema. Está em separação.",
    hora: "09:18",
    status: "lida",
    respostaA: null,
    reacoes: [],
  },
  {
    id: 3,
    minha: false,
    texto: "Perfeito! Qualquer novidade me avisa.",
    hora: "09:20",
    respostaA: null,
    reacoes: [],
  },
  {
    id: 4,
    minha: false,
    arquivo: {
      nome: "Pedido_4521.pdf",
      tamanho: "2,4 MB",
      tipo: "pdf",
    },
    hora: "09:22",
    respostaA: null,
    reacoes: [],
  },
];

const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

function agora() {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

function formatarTamanho(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

function Ticks({ status }: { status?: Status }) {
  if (!status) return null;

  const cor = status === "lida" ? "text-sky-300" : "text-white/70";

  return (
    <span className={`ml-1 text-[11px] ${cor}`}>
      {status === "enviada" ? "✓" : "✓✓"}
    </span>
  );
}

export default function ChatCliente({ id }: { id: string }) {
  const nome = nomes[id] ?? "Conversa";

  const [msgs, setMsgs] = useState<Msg[]>(inicial);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const [respondendo, setRespondendo] = useState<Msg | null>(null);
  const [reacaoAberta, setReacaoAberta] = useState<number | null>(null);

  const arquivoRef = useRef<HTMLInputElement>(null);

  const horarioPermitido = dentroDoHorario();

  function simularStatus(msgId: number) {
    setTimeout(() => {
      setMsgs((mensagens) =>
        mensagens.map((m) =>
          m.id === msgId ? { ...m, status: "entregue" } : m
        )
      );
    }, 1000);

    setTimeout(() => {
      setMsgs((mensagens) =>
        mensagens.map((m) =>
          m.id === msgId ? { ...m, status: "lida" } : m
        )
      );
    }, 2500);
  }

  function adicionar(parcial: Partial<Msg>): boolean {
    if (!dentroDoHorario()) {
      setAviso("Fora do horário de uso (8h às 18h). Não é possível enviar.");
      return false;
    }

    setAviso("");

    const novoId = Date.now();

    setMsgs((mensagens) => [
      ...mensagens,
      {
        id: novoId,
        minha: true,
        hora: agora(),
        status: "enviada",
        respostaA: respondendo?.id ?? null,
        reacoes: [],
        ...parcial,
      },
    ]);

    setRespondendo(null);
    simularStatus(novoId);

    return true;
  }

  function enviarTexto() {
    const t = texto.trim();

    if (!t) return;

    if (adicionar({ texto: t })) {
      setTexto("");
    }
  }

  function escolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];

    if (!f) return;

    if (!dentroDoHorario()) {
      setAviso("Fora do horário de uso (8h às 18h). Não é possível enviar.");
      e.target.value = "";
      return;
    }

    if (f.type === "application/pdf") {
      adicionar({
        arquivo: {
          nome: f.name,
          tamanho: formatarTamanho(f.size),
          tipo: "pdf",
        },
      });
    } else if (f.type === "image/jpeg") {
      adicionar({
        arquivo: {
          nome: f.name,
          tamanho: formatarTamanho(f.size),
          tipo: "imagem",
          url: URL.createObjectURL(f),
        },
      });
    } else {
      setAviso("Só é permitido enviar arquivos PDF e imagens JPEG.");
    }

    e.target.value = "";
  }

  function reagir(msgId: number, emoji: string) {
    setMsgs((mensagens) =>
      mensagens.map((m) => {
        if (m.id !== msgId) return m;

        const reacoes = m.reacoes ?? [];

        return {
          ...m,
          reacoes: reacoes.includes(emoji)
            ? reacoes.filter((r) => r !== emoji)
            : [...reacoes, emoji],
        };
      })
    );
  }

  function iniciarResposta(msg: Msg) {
    setRespondendo(msg);
    setAviso("");
  }

  function textoDaMensagem(msg: Msg) {
    if (msg.texto) return msg.texto;
    if (msg.arquivo) return `📎 ${msg.arquivo.nome}`;
    return "Mensagem";
  }

  return (
    <main className="flex min-h-screen bg-slate-100 md:pl-56">
      <div className="flex min-h-screen w-full min-w-0 flex-col">
        <header className="flex shrink-0 items-center gap-3 bg-[#0e1f7a] px-4 py-4 text-white">
          <Link
            href="/conversas"
            aria-label="Voltar"
            className="text-xl font-bold"
          >
            ←
          </Link>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-base font-bold">
            {nome.charAt(0)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight">{nome}</p>
            <p className="text-xs font-medium text-emerald-300">Online</p>
          </div>
        </header>

        <div className="min-w-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-4 pb-36">
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

                    {m.arquivo?.tipo === "pdf" && (
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-10 w-9 shrink-0 items-center justify-center rounded bg-red-500 text-[10px] font-bold text-white">
                          PDF
                        </div>

                        <div className="min-w-0">
                          <p className="break-all text-sm font-bold">
                            {m.arquivo.nome}
                          </p>
                          <p
                            className={`text-xs ${
                              m.minha ? "text-white/70" : "text-slate-500"
                            }`}
                          >
                            {m.arquivo.tamanho}
                          </p>
                        </div>
                      </div>
                    )}

                    {m.arquivo?.tipo === "imagem" && (
                      <div className="min-w-0">
                        {m.arquivo.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.arquivo.url}
                            alt={m.arquivo.nome}
                            className="max-h-48 max-w-full rounded-lg object-contain"
                          />
                        )}

                        <p className="mt-1 break-all text-xs">{m.arquivo.nome}</p>
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
                      {m.reacoes.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => reagir(m.id, emoji)}
                          title={`Remover reação ${emoji}`}
                          className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

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
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 z-30 w-full border-t border-slate-200 bg-white px-3 py-3 md:left-56 md:w-[calc(100%-14rem)]">
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
              disabled={!horarioPermitido}
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
              disabled={!horarioPermitido || !texto.trim()}
              aria-label="Enviar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3d3fe8] text-lg text-white transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
