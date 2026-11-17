"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contextos/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { entrar: autenticar } = useAuth();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || "Não foi possível realizar o login.");
      }

      if (
        !dados.token ||
        !dados.usuario?.id ||
        !["USER", "IT_ADMIN"].includes(dados.usuario.role)
      ) {
        throw new Error("Resposta de autenticação inválida.");
      }

      autenticar({
        id: dados.usuario.id,
        name: dados.usuario.name,
        email: dados.usuario.email,
        role: dados.usuario.role,
      });

      sessionStorage.setItem("callzup_login_pendente", "true");

      if (dados.usuario.role === "IT_ADMIN") {
        router.push("/ti");
      } else {
        router.push("/conversas");
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-6 pt-14 pb-10 flex flex-col items-center">
        <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-300/50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.6L5 21l4.2-2c.9.2 1.8.3 2.8.3 5 0 9-3.6 9-8.3S17 3 12 3z" fill="white" />
            <path d="M8.5 11.3l2.4 2.4 4.6-4.6" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-3 text-3xl tracking-tight">
          <span className="font-semibold text-[#1e2a78]">call</span>
          <span className="font-extrabold text-[#3b3fe0]">ZUP</span>
        </h1>

        <h2 className="mt-10 text-xl font-bold text-[#1e2a78]">
          Bem-vindo de volta!
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Faça login para continuar
        </p>

        <form onSubmit={entrar} className="mt-7 w-full space-y-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-[#3b3fe0]">
            <input
              type="email"
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-[#3b3fe0]">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label="Mostrar ou ocultar senha"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </label>

          {erro && (
            <p className="text-sm text-red-600" role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="block w-full rounded-2xl bg-[#3d3fe8] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-300/60 transition duration-150 active:scale-90 disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          Esqueceu a senha ou não tem acesso?
          <br />
          Fale com a equipe de TI da sua empresa.
        </p>
      </div>
    </main>
  );
}