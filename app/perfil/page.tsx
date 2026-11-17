import Link from "next/link";
import BarraInferior from "../comp/BarraInferior";

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-28">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3d3fe8]">Conta</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1e2a78]">Meu perfil</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Consulte seus dados e preferências de acesso.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="profile-pending-title">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-[#3d3fe8]" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 id="profile-pending-title" className="font-bold text-[#1e2a78]">Dados do perfil</h2>
              <p className="mt-1 text-sm text-slate-500">Disponibilidade em uma próxima versão</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            A edição de nome, foto, informações profissionais e preferências ainda não está conectada ao sistema.
          </p>
          <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Suas informações de conta serão exibidas aqui quando a integração de perfil estiver disponível.
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-[#1e2a78]">Precisa de ajuda com seu acesso?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Solicite suporte ou uma conversa privada com a equipe responsável.
          </p>
          <Link
            href="/solicitar"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-[#3d3fe8] transition hover:bg-indigo-50"
          >
            Solicitar suporte
          </Link>
        </section>
      </div>
      <BarraInferior ativo="Perfil" />
    </main>
  );
}
