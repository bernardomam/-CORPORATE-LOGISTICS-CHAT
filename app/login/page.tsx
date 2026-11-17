"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center px-4">
      <div className="w-full max-w-sm py-10 flex flex-col items-center">
        <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-300/50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.6L5 21l4.2-2c.9.2 1.8.3 2.8.3 5 0 9-3.6 9-8.3S17 3 12 3z"
              fill="white"
            />
            <path
              d="M8.5 11.3l2.4 2.4 4.6-4.6"
              stroke="#4338ca"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-3 text-3xl tracking-tight">
          <span className="font-semibold text-[#1e2a78]">call</span>
          <span className="font-extrabold text-[#3b3fe0]">ZUP</span>
        </h1>

        <section className="mt-8 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="login-title">
          <h2 id="login-title" className="text-xl font-bold text-[#1e2a78]">
            Bem-vindo de volta!
          </h2>
          <p className="mt-1 text-sm text-slate-600">Entre com os dados da sua conta corporativa.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                E-mail corporativo
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-[#3b3fe0] focus-within:ring-2 focus-within:ring-indigo-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="seuemail@empresa.com"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-[#3b3fe0] focus-within:ring-2 focus-within:ring-indigo-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  id="senha"
                  name="password"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/conversas"
            className="mt-6 block w-full rounded-xl bg-[#3d3fe8] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-300/50 transition hover:bg-[#3032c9] active:scale-[0.99]"
          >
            Entrar
          </Link>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Esqueceu a senha ou não tem acesso?
            <br />
            Fale com a equipe de TI da sua empresa.
          </p>
        </section>
        <p className="mt-6 text-center text-xs text-slate-400">Comunicação simples, segura e eficiente.</p>
      </div>
    </main>
  );
}
