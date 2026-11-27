
  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { useAuth } from "../contextos/AuthContext";

  type Perfil = "USER" | "IT_ADMIN";

  const icones: Record<string, React.ReactNode> = {
    chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
    grupo: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M17 14c2.7 0 4.5 1.8 4.5 4.5" />
      </>
    ),
    pessoa: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
    pedido: (
      <>
        <path d="M4 4h16v12H8l-4 4z" />
        <path d="M12 8v4M10 10h4" />
      </>
    ),
  };

  const menus: Record<Perfil, { nome: string; href: string; icone: string }[]> = {
    USER: [
      { nome: "Conversas", href: "/conversas", icone: "chat" },
      { nome: "Grupos", href: "/grupos", icone: "grupo" },
      { nome: "Perfil", href: "/perfil", icone: "pessoa" },
    ],
    IT_ADMIN: [
    { nome: "Conversas", href: "/conversas", icone: "chat" },
    { nome: "Grupos", href: "/grupos", icone: "grupo" },
    { nome: "Perfil", href: "/perfil", icone: "pessoa" },
  ],
  };
  export default function BarraInferior({ ativo }: { ativo: string }) {
    const { usuario } = useAuth();
    const [perfilTeste, setPerfilTeste] = useState<Perfil | null>(null);

    useEffect(() => {
      if (process.env.NODE_ENV !== "development") return;

      try {
        const salvo = localStorage.getItem("callzup_perfil");

        if (salvo === "USER" || salvo === "IT_ADMIN") {
          setPerfilTeste(salvo);
        }
      } catch {}
    }, []);

    const perfil: Perfil =
      process.env.NODE_ENV === "development" && perfilTeste
        ? perfilTeste
        : usuario?.role ?? "USER";

    function alternar() {
      const novo: Perfil = perfil === "USER" ? "IT_ADMIN" : "USER";

      setPerfilTeste(novo);

      try {
        localStorage.setItem("callzup_perfil", novo);
      } catch {}
    }

    const menu = menus[perfil];
    const itensMenu = menu.filter((item) => item.nome !== "Perfil");
    const itemPerfil = menu.find((item) => item.nome === "Perfil")!;

    function icone(item: (typeof menu)[number]) {
      return (
        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          {icones[item.icone]}
        </svg>
      );
    }

    function linkClasses(nome: string) {
      const selecionado = nome === ativo;

      return `group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all duration-200 md:w-full md:flex-row md:justify-start md:gap-3 md:px-3 md:py-3 ${
        selecionado
          ? "bg-indigo-50 text-[#5146e5] md:shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-[#5146e5]"
      }`;
    }

    return (
      <>
        {process.env.NODE_ENV === "development" && (
          <button
            type="button"
            onClick={alternar}
            className="fixed right-3 top-3 z-50 rounded-full bg-slate-900 px-3 py-2 text-[11px] font-bold text-white shadow-lg transition hover:bg-slate-700"
          >
            Teste: {perfil}
          </button>
        )}

        <nav className="fixed bottom-0 left-0 z-40 flex h-[76px] w-full items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 shadow-[0_-4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl md:bottom-0 md:top-0 md:h-screen md:w-56 md:flex-col md:items-stretch md:justify-start md:border-r md:border-t-0 md:px-4 md:py-6 md:shadow-[4px_0_24px_rgba(15,23,42,0.03)]">
          <div className="hidden px-3 pb-9 md:block">
            <p className="text-[26px] tracking-tight">
              <span className="font-semibold text-[#1e2a78]">call</span>
              <span className="font-extrabold text-[#5146e5]">ZUP</span>
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">
              Comunicação corporativa
            </p>
          </div>

          <div className="flex w-full items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start md:gap-2">
            {itensMenu.map((item) => (
              <Link
                key={item.nome}
                href={item.href}
                aria-current={item.nome === ativo ? "page" : undefined}
                className={linkClasses(item.nome)}
              >
                {icone(item)}
                <span className="text-[10px] font-semibold md:text-sm">
                  {item.nome}
                </span>

                {item.nome === ativo && (
                  <span className="hidden md:ml-auto md:block">
                    <span className="block h-1.5 w-1.5 rounded-full bg-[#5146e5]" />
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden flex-1 md:block" />

          <div className="hidden border-t border-slate-100 pt-4 md:block">
            <Link
              href={itemPerfil.href}
              aria-current={itemPerfil.nome === ativo ? "page" : undefined}
              className={linkClasses(itemPerfil.nome)}
            >
              {icone(itemPerfil)}
              <span className="text-sm font-semibold">Perfil</span>
            </Link>

            <p className="mt-4 px-3 text-[10px] font-medium text-slate-400">
              CALZUP • AMBIENTE CORPORATIVO
            </p>
          </div>

          <Link
            href={itemPerfil.href}
            aria-current={itemPerfil.nome === ativo ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 md:hidden ${
              itemPerfil.nome === ativo ? "text-[#5146e5]" : "text-slate-500"
            }`}
          >
            {icone(itemPerfil)}
            <span className="text-[10px] font-semibold">Perfil</span>
          </Link>
        </nav>
      </>
    );
  }
