import Link from "next/link";

export default function ForaDoHorario() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-[#1e2a78]">Fora do horário</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          O callZUP funciona das 8h às 18h (horário de Brasília).
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-bold text-[#3d3fe8]"
        >
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}