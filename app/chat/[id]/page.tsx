
import { Suspense } from "react";
import ChatCliente from "./ChatCliente";

async function Conteudo({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { id } = await params;
  const { tipo } = await searchParams;

  const tipoConversa = tipo === "grupo" ? "grupo" : "privada";

  return (
    <ChatCliente
      id={id}
      tipoConversa={tipoConversa}
    />
  );
}

export default function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Conteudo
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
