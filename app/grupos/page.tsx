import BarraInferior from "../componentes/BarraInferior";

export default function GruposPage() {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-24">
        <h1 className="text-3xl font-bold text-[#1e2a78]">Grupos</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Em breve: lista e criação de grupos.
        </p>
      </div>
      <BarraInferior ativo="Grupos" />
    </main>
  );
}