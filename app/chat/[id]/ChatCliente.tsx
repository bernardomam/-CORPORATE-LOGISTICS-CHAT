"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
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
  dataChave: string;
  dataRotulo: string;
  status?: Status;
  respostaA: string | null;
  reacoes: string[];
};

type MensagemBackend = {
  id: string;
  content?: string;
  type?: string;
  text?: string;
  senderId?: string;
  userId?: string;
  sender?: { id?: string; name?: string; role?: "USER" | "IT_ADMIN" };
  createdAt?: string;
  replyToId?: string | null;
  reactions?: Array<string | { emoji?: string }>;
};

type RespostaUploadAnexo = {
  sucesso: true;
  id: string;
};

const LIMITE_ANEXO_BYTES = 4_194_304;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mensagemErroAnexo(status: number, acao: "enviar" | "baixar") {
  if (status === 400) return "O arquivo ou os dados enviados são inválidos.";
  if (status === 401) return "Sua sessão expirou. Entre novamente na sua conta.";
  if (status === 403) return "Ação não permitida. Verifique seu acesso e o horário de funcionamento (8h às 18h).";
  if (status === 404) return acao === "enviar" ? "A conversa não foi encontrada ou você não tem acesso a ela." : "Este anexo não foi encontrado ou você não tem acesso a ele.";
  if (status === 413) return "O arquivo ultrapassa o limite de 4 MiB.";
  if (status === 415) return "Formato ou conteúdo inválido. Envie um PDF ou JPEG válido.";
  if (status === 429) return "Muitas tentativas em pouco tempo. Aguarde e tente novamente.";
  if (status === 500 || status === 502 || status === 503) return "O servidor ou o armazenamento está temporariamente indisponível. Tente novamente mais tarde.";
  return acao === "enviar" ? "Não foi possível enviar o anexo." : "Não foi possível baixar o anexo.";
}

const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const FUSO_HORARIO = "America/Sao_Paulo";

function obterPartesData(data: Date) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: FUSO_HORARIO,
  }).formatToParts(data);

  const ano = partes.find((parte) => parte.type === "year")?.value ?? "";
  const mes = partes.find((parte) => parte.type === "month")?.value ?? "";
  const dia = partes.find((parte) => parte.type === "day")?.value ?? "";

  return { ano, mes, dia, chave: `${ano}-${mes}-${dia}` };
}

function obterRotuloData(data: Date) {
  const partesData = obterPartesData(data);
  const partesHoje = obterPartesData(new Date());

  const hojeUTC = Date.UTC(
    Number(partesHoje.ano),
    Number(partesHoje.mes) - 1,
    Number(partesHoje.dia)
  );

  const ontem = new Date(hojeUTC - 24 * 60 * 60 * 1000);

  const partesOntem = {
    ano: String(ontem.getUTCFullYear()),
    mes: String(ontem.getUTCMonth() + 1).padStart(2, "0"),
    dia: String(ontem.getUTCDate()).padStart(2, "0"),
  };

  const chaveOntem = `${partesOntem.ano}-${partesOntem.mes}-${partesOntem.dia}`;

  let rotulo = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: FUSO_HORARIO,
  }).format(data);

  if (partesData.chave === partesHoje.chave) {
    rotulo = "Hoje";
  } else if (partesData.chave === chaveOntem) {
    rotulo = "Ontem";
  }

  return { chave: partesData.chave, rotulo };
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

  // Administradores só escrevem em grupos dos quais são membros ativos.
  // A API de grupos próprios confirma a participação; o backend revalida cada envio.
  const [grupoAdminAutorizado, setGrupoAdminAutorizado] = useState<{
    id: string; token: string;
  } | null>(null);
  useEffect(() => {
    if (!isAdminTI || tipoConversa !== "grupo" || !token) return;
    let cancelado = false;
    void (async () => {
      try {
        const dados = await api("/api/my-groups", { method: "GET", token });
        const participa = dados?.sucesso === true && Array.isArray(dados.grupos)
          && dados.grupos.some((grupo: { id: string }) => grupo.id === id);
        if (!cancelado) setGrupoAdminAutorizado(participa ? { id, token } : null);
      } catch {
        if (!cancelado) setGrupoAdminAutorizado(null);
      }
    })();
    return () => { cancelado = true; };
  }, [isAdminTI, tipoConversa, id, token]);
  const somenteLeitura = isAdminTI && (
    tipoConversa !== "grupo" || !token ||
    grupoAdminAutorizado?.id !== id || grupoAdminAutorizado?.token !== token
  );

  const contato = participantes[0] ?? null;

  const nome =
    tipoConversa === "privada"
      ? contato?.nome ?? "Conversa privada"
      : "Grupo";

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [carregandoMensagens, setCarregandoMensagens] = useState(true);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [respondendo, setRespondendo] = useState<Msg | null>(null);
  const [reacaoAberta, setReacaoAberta] = useState<string | null>(null);
  const [informacoesAbertas, setInformacoesAbertas] = useState(false);
  const [participanteSelecionado, setParticipanteSelecionado] =
    useState<Participante | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [urlsImagens, setUrlsImagens] = useState<Record<string, string>>({});
  const [falhasImagens, setFalhasImagens] = useState<Record<string, boolean>>({});
  const [imagemAmpliada, setImagemAmpliada] = useState<string | null>(null);

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

      const lista = dados?.mensagens;

      if (!Array.isArray(lista)) {
        throw new Error("O histórico retornou um formato de mensagens inválido.");
      }

      const formatadas: Msg[] = lista.map(
        (mensagem: MensagemBackend) => {
          const remetenteId = mensagem.userId ?? mensagem.sender?.id;
          const dataMensagem = mensagem.createdAt;

          const dataConvertida = dataMensagem ? new Date(dataMensagem) : null;
          const dataValida =
            dataConvertida && !Number.isNaN(dataConvertida.getTime())
              ? dataConvertida
              : null;

          const dadosData = dataValida
            ? obterRotuloData(dataValida)
            : { chave: "sem-data", rotulo: "Data não informada" };

          let anexo: Msg["arquivo"] = undefined;

          if (mensagem.type === "FILE" || mensagem.type === "IMAGE") {
            try {
              const meta: unknown = JSON.parse(mensagem.content || "");

              if (meta && typeof meta === "object") {
                const arquivo = meta as {
                  nome?: unknown;
                  mime?: unknown;
                  size?: unknown;
                };

                const mimeEsperado =
                  mensagem.type === "FILE"
                    ? "application/pdf"
                    : "image/jpeg";

                if (
                  typeof arquivo.nome === "string" &&
                  typeof arquivo.size === "number" &&
                  Number.isFinite(arquivo.size) &&
                  arquivo.size >= 0 &&
                  arquivo.mime === mimeEsperado
                ) {
                  anexo = {
                    nome: arquivo.nome,
                    tamanho:
                      arquivo.size < 1024 * 1024
                        ? `${(arquivo.size / 1024).toFixed(1)} KB`
                        : `${(arquivo.size / (1024 * 1024)).toFixed(2)} MB`,
                    tipo: mensagem.type === "FILE" ? "pdf" : "imagem",
                  };
                }
              }
            } catch {
              // Metadados inválidos não devem interromper o carregamento do histórico.
            }
          }

          return {
            arquivo: anexo,
            id: String(mensagem.id),
            minha: String(remetenteId) === String(usuario?.id),
            texto: anexo ? "" : mensagem.content ?? mensagem.text ?? "",
            hora: dataValida
              ? new Intl.DateTimeFormat("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                  timeZone: FUSO_HORARIO,
                }).format(dataValida)
              : "--:--",
            dataChave: dadosData.chave,
            dataRotulo: dadosData.rotulo,
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
      return formatadas;
    } catch (error) {
      setAviso(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as mensagens."
      );
      return null;
    } finally {
      setCarregandoMensagens(false);
    }
  }, [id, tipoConversa, token, usuario?.id]);

  useEffect(() => {
    setMsgs([]);
    setCarregandoMensagens(true);
    void carregarMensagens();
  }, [carregarMensagens]);

  const idsImagens = msgs
    .filter((mensagem) => mensagem.arquivo?.tipo === "imagem")
    .map((mensagem) => mensagem.id)
    .join("|");

  useEffect(() => {
    let cancelado = false;
    const urlsCriadas: string[] = [];

    setUrlsImagens({});
    setFalhasImagens({});

    if (!token || !idsImagens) {
      return () => {
        cancelado = true;
      };
    }

    async function carregarImagens() {
      const ids = idsImagens.split("|");

      const pares = await Promise.all(
        ids.map(async (messageId) => {
          try {

            const resposta = await fetch(
              `/api/attachments/${encodeURIComponent(messageId)}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
              }
            );

            if (!resposta.ok) {
              return { id: messageId, erro: true as const };
            }

            const blob = await resposta.blob();

            if (blob.type && blob.type !== "image/jpeg") {
              return { id: messageId, erro: true as const };
            }

            const url = URL.createObjectURL(blob);
            urlsCriadas.push(url);

            return { id: messageId, url } as const;
          } catch {
            return { id: messageId, erro: true as const };
          }
        })
      );

      if (cancelado) {
        urlsCriadas.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      const novasUrls: Record<string, string> = {};
      const novasFalhas: Record<string, boolean> = {};

      pares.forEach((par) => {
        if (par && typeof par.url === "string") {
          novasUrls[par.id] = par.url;
        } else if (par) {
          novasFalhas[par.id] = true;
        }
      });

      setUrlsImagens(novasUrls);
      setFalhasImagens(novasFalhas);
    }

    void carregarImagens();

    return () => {
      cancelado = true;
      urlsCriadas.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [idsImagens, token]);

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

  async function escolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo || somenteLeitura || enviando || !token) return;
    if (!["application/pdf", "image/jpeg"].includes(arquivo.type) || arquivo.size > 4 * 1024 * 1024 || !arquivo.size) {
      setAviso("Selecione um PDF ou JPEG de até 4 MB.");
      return;
    }
    setEnviando(true);
    try {
      const rota = tipoConversa === "grupo" ? "grupo" : "privado";
      const res = await fetch("/api/attachments/" + rota + "/" + encodeURIComponent(id) + "?nome=" + encodeURIComponent(arquivo.name), {
        method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": arquivo.type }, body: arquivo
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.mensagem || "Falha ao enviar arquivo.");
      await carregarMensagens();
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "Falha ao enviar arquivo.");
    } finally { setEnviando(false); }
  }

  async function baixarArquivo(msg: Msg) {
    if (!token || !msg.arquivo) return;
    try {
      const res = await fetch("/api/attachments/" + encodeURIComponent(msg.id), { headers: { Authorization: "Bearer " + token }, cache: "no-store" });
      if (!res.ok) throw new Error("Não foi possível acessar o arquivo.");
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = msg.arquivo.nome;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "Falha ao baixar arquivo.");
    }
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

        {imagemAmpliada && urlsImagens[imagemAmpliada] && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setImagemAmpliada(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Visualização ampliada da imagem"
          >
            <button
              type="button"
              onClick={() => setImagemAmpliada(null)}
              className="absolute right-5 top-4 rounded-full bg-white/15 px-3 py-1 text-3xl text-white"
              aria-label="Fechar imagem"
            >
              ×
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlsImagens[imagemAmpliada]}
              alt={
                msgs.find((mensagem) => mensagem.id === imagemAmpliada)?.arquivo?.nome ||
                "Imagem ampliada"
              }
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

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

          {msgs.map((m, indice) => {
            const mensagemRespondida = msgs.find(
              (mensagem) => mensagem.id === m.respostaA
            );

            const mostrarData =
              indice === 0 || msgs[indice - 1].dataChave !== m.dataChave;

            return (
              <Fragment key={m.id}>
                {mostrarData && (
                  <div className="flex justify-center py-2">
                    <span className="rounded-lg bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                      {m.dataRotulo}
                    </span>
                  </div>
                )}

                <div
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
                        <button
                          type="button"
                          onClick={() => void baixarArquivo(m)}
                          className="flex min-w-0 items-center gap-2 text-left"
                        >
                          <div className="flex h-10 w-9 shrink-0 items-center justify-center rounded bg-red-500 text-[10px] font-bold text-white">
                            PDF
                          </div>

                          <div className="min-w-0">
                            <p className="break-all text-sm font-bold">
                              {m.arquivo.nome}
                            </p>

                            <p className="text-xs opacity-70">
                              {m.arquivo.tamanho} · Baixar documento
                            </p>
                          </div>
                        </button>
                      )}

                      {m.arquivo?.tipo === "imagem" && (
                        <div className="min-w-0 space-y-2">
                          {urlsImagens[m.id] ? (
                            <button
                              type="button"
                              onClick={() => setImagemAmpliada(m.id)}
                              className="block max-w-full overflow-hidden rounded-lg"
                              aria-label={`Ampliar imagem ${m.arquivo.nome}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={urlsImagens[m.id]}
                                alt={m.arquivo.nome}
                                className="max-h-72 max-w-full rounded-lg object-contain"
                              />
                            </button>
                          ) : (
                            <p className="text-xs opacity-70">
                              {falhasImagens[m.id]
                                ? "Não foi possível carregar a imagem."
                                : "Carregando imagem..."}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="min-w-0 break-all font-semibold">
                              {m.arquivo.nome} · {m.arquivo.tamanho}
                            </span>

                            <button
                              type="button"
                              onClick={() => void baixarArquivo(m)}
                              className="shrink-0 underline"
                            >
                              Baixar
                            </button>
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
                                    void reagir(m.id, emoji);
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
              </Fragment>
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

            {confirmacao && (
              <p
                className="mb-2 text-center text-xs font-semibold text-emerald-600"
                role="status"
              >
                {confirmacao}
              </p>
            )}

            {enviando && (
              <p
                className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#3d3fe8]"
                role="status"
                aria-live="polite"
              >
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#3d3fe8] border-t-transparent" />
                Enviando...
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
                disabled={!horarioPermitido || enviando}
                onClick={() => arquivoRef.current?.click()}
                aria-label="Anexar PDF ou JPEG"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-[#1e2a78] transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                📎
              </button>

              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void enviarTexto()}
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
                onClick={() => void enviarTexto()}
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