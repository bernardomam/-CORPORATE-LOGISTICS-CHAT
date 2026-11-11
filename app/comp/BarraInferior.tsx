import Link from "next/link";

const itens = [
  {
    nome: "Conversas",
    href: "/conversas",
    icone: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  },
  {
    nome: "Grupos",
    href: "/grupos",
    icone: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M17 14c2.7 0 4.5 1.8 4.5 4.5" />
      </>
    ),
  },
  {
    nome: "Perfil",
    href: "/perfil",
    icone: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
  },
];

export default function BarraInferior({ ativo }: { ativo: string }) {
  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-sm -translate-x-1/2 justify-around border-t border-slate-200 bg-white py-2">
      {itens.map((item) => (
        <Link
          key={item.nome}
          href={item.href}
          className={`flex flex-col items-center gap-1 transition active:scale-90 ${
            item.nome === ativo ? "text-[#3d3fe8]" : "text-slate-400"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {item.icone}
          </svg>
          <span className="text-xs font-bold">{item.nome}</span>
        </Link>
      ))}
    </nav>
  );
}