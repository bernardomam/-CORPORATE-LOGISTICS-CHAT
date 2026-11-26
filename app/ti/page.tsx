"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contextos/AuthContext";

export default function PainelTI() {
  const { usuario, carregandoAuth, sair } = useAuth();
  const router = useRouter();

  if (carregandoAuth || usuario?.role !== "IT_ADMIN") return null;

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-lg px-5 pt-8 pb-10">
        <h1 className="text-2xl font-bold text-[#1e2a78]">Painel da TI</h1>
        <p className="mt-2 text-sm text-slate-600">Olá, {usuario.name}.</p>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-[#1e2a78]">Administração de funcionários e grupos</h2>
          <p className="mt-2 text-sm text-slate-600">
            O cadastro de funcionários e a gestão de participantes são realizados pela equipe de TI por meio do procedimento administrativo autorizado. Não há solicitação de entrada em grupos pelo aplicativo.
          </p>
        </section>
        <div className="mt-5 flex flex-col gap-3">
          <Link href="/conversas" className="rounded-xl bg-indigo-600 p-3 text-center font-semibold text-white">Conversas</Link>
          <Link href="/grupos" className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold text-indigo-700">Meus grupos</Link>
          <Link href="/perfil" className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold text-indigo-700">Meu perfil</Link>
          <button type="button" onClick={() => { sair(); router.replace("/login"); }} className="rounded-xl bg-red-50 p-3 font-semibold text-red-700">Sair da conta</button>
        </div>
      </div>
    </main>
  );
}
