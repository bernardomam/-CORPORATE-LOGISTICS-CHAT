
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useAuth } from "../contextos/AuthContext";
import BarraInferior from "../comp/BarraInferior";
import { api } from "../lib/api";

type DadosPerfil = {
  id?: string;
  name: string;
  role: "USER" | "IT_ADMIN";
  avatarUrl?: string | null;
  jobTitle?: string | null;
  department?: {
    name?: string;
  } | null;
};

function CartaoPerfil({
  perfil,
  editavel = false,
  onAlterarFoto,
}: {
  perfil: DadosPerfil;
  editavel?: boolean;
  onAlterarFoto?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const nome = perfil.name || "Nome do funcionário";

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");

  const tipoConta =
    perfil.role === "IT_ADMIN" ? "Administrador de TI" : "Usuário";

  return (
    <>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {perfil.avatarUrl ? (
              <img
                src={perfil.avatarUrl}
                alt="Foto de perfil"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
                {iniciais || "U"}
              </div>
            )}
          </div>

          {editavel && (
            <>
              <label
                htmlFor="fotoPerfil"
                className="mt-3 cursor-pointer text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Editar foto
              </label>

              <input
                id="fotoPerfil"
                type="file"
                accept="image/*"
                onChange={onAlterarFoto}
                className="hidden"
              />
            </>
          )}

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            {nome}
          </h2>

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
              {perfil.jobTitle || "Não informado"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Setor
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {perfil.department?.name || "Não informado"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tipo de conta
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {tipoConta}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PerfilPage() {
  const { usuario, token, sair } = useAuth();
  const router = useRouter();

  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [dadosPerfil, setDadosPerfil] = useState<DadosPerfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      if (!token) {
        setCarregando(false);
        setErro("Sessão não encontrada. Entre novamente na sua conta.");
        return;
      }

      try {
        setErro("");

        const dados = await api("/api/auth/me", {
          method: "GET",
          token,
        });

        if (dados?.sucesso === false) {
          throw new Error(
            dados.mensagem || "Não foi possível carregar o perfil."
          );
        }

        const usuarioBackend =
          dados?.usuario ?? dados?.user ?? dados?.data?.usuario ?? dados?.data;

        if (!usuarioBackend) {
          throw new Error("O servidor não retornou os dados do perfil.");
        }

        setDadosPerfil({
          id: usuarioBackend.id ?? usuario?.id,
          name: usuarioBackend.name ?? usuario?.name ?? "Nome do funcionário",
          role: usuarioBackend.role ?? usuario?.role ?? "USER",
          avatarUrl: usuarioBackend.avatarUrl ?? null,
          jobTitle: usuarioBackend.jobTitle ?? null,
          department: usuarioBackend.department ?? null,
        });
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o perfil."
        );

        setDadosPerfil({
          id: usuario?.id,
          name: usuario?.name || "Nome do funcionário",
          role: usuario?.role || "USER",
        });
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [token, usuario]);

  function alterarFoto(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const novaFoto = URL.createObjectURL(arquivo);

    setFotoPreview((fotoAnterior) => {
      if (fotoAnterior) URL.revokeObjectURL(fotoAnterior);
      return novaFoto;
    });
  }

  const perfil: DadosPerfil = dadosPerfil ?? {
    id: usuario?.id,
    name: usuario?.name || "Nome do funcionário",
    role: usuario?.role || "USER",
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto w-full max-w-2xl px-5 pt-8">
        <h1 className="text-3xl font-bold text-[#1e2a78]">
          Meu perfil
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Suas informações pessoais e profissionais.
        </p>

        {carregando && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Carregando informações do perfil...
          </p>
        )}

        {!carregando && erro && (
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {erro}
          </p>
        )}

        {!carregando && (
          <CartaoPerfil
            perfil={{
              ...perfil,
              avatarUrl: fotoPreview || perfil.avatarUrl,
            }}
            editavel
            onAlterarFoto={alterarFoto}
          />
        )}
      </div>

      <div className="mx-auto max-w-2xl px-5 mt-6">
        <button type="button" onClick={() => { sair(); router.replace("/login"); }} className="w-full rounded-xl bg-red-50 p-3 font-semibold text-red-700">Sair da conta</button>
      </div>
      <BarraInferior ativo="Perfil" />
    </main>
  );
}
