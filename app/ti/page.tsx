"use client";

import { useState } from "react";
import Link from "next/link";

type Perfil = "Usuário" | "Diretor" | "TI";
type Usuario = { id: number; nome: string; email: string; perfil: Perfil; ativo: boolean };
type Grupo = { id: number; nome: string };

export default function PainelTI() {
  const [aba, setAba] = useState<"usuarios" | "grupos">("usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: "Carlos Almeida", email: "carlos@empresa.com", perfil: "Usuário", ativo: true },
    { id: 2, nome: "Ana Costa", email: "ana@empresa.com", perfil: "Diretor", ativo: true },
  ]);
  const [grupos, setGrupos] = useState<Grupo[]>([
    { id: 1, nome: "Equipe Logística" },
    { id: 2, nome: "Diretoria" },
  ]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("Usuário");
  const [novoGrupo, setNovoGrupo] = useState("");

  function criarUsuario() {
    if (!nome.trim() || !email.trim()) return;
    setUsuarios([...usuarios, { id: Date.now(), nome, email, perfil, ativo: true }]);
    setNome("");
    setEmail("");
  }

  function alternar(id: number) {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u)));
  }

  function criarGrupo() {
    if (!novoGrupo.trim()) return;
    setGrupos([...grupos, { id: Date.now(), nome: novoGrupo }]);
    setNovoGrupo("");
  }

  function editarGrupo(g: Grupo) {
    const n = window.prompt("Novo nome do grupo:", g.nome);
    if (n && n.trim()) setGrupos(grupos.map((x) => (x.id === g.id ? { ...x, nome: n } : x)));
  }

  const campo = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#3b3fe0]";
  const botao = "rounded-xl bg-[#3d3fe8] px-4 py-2.5 text-sm font-bold text-white transition active:scale-95";

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm px-5 pt-8 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1e2a78]">Painel da TI</h1>
          <Link href="/conversas" className="text-sm font-bold text-[#3d3fe8]">Sair</Link>
        </div>

        <div className="mt-4 flex gap-2">
          {(["usuarios", "grupos"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`flex-1 rounded-full py-2 text-sm font-bold ${aba === a ? "bg-[#3d3fe8] text-white" : "bg-slate-100 text-[#1e2a78]"}`}
            >
              {a === "usuarios" ? "Usuários" : "Grupos"}
            </button>
          ))}
        </div>

        {aba === "usuarios" ? (
          <div className="mt-5 space-y-3">
            <input className={campo} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input className={campo} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className={campo} value={perfil} onChange={(e) => setPerfil(e.target.value as Perfil)}>
              <option>Usuário</option>
              <option>Diretor</option>
              <option>TI</option>
            </select>
            <button onClick={criarUsuario} className={`${botao} w-full`}>Cadastrar usuário</button>
            <p className="text-xs font-medium text-slate-500">Os dados de acesso serão enviados por e-mail ao usuário.</p>

            <ul className="pt-2">
              {usuarios.map((u) => (
                <li key={u.id} className="flex items-center justify-between border-b border-slate-100 py-3">
                  <div>
                    <p className={`text-[15px] font-bold ${u.ativo ? "text-[#1e2a78]" : "text-slate-400 line-through"}`}>{u.nome}</p>
                    <p className="text-xs font-medium text-slate-500">{u.email} · {u.perfil}</p>
                  </div>
                  <button onClick={() => alternar(u.id)} className="text-xs font-bold text-[#3d3fe8]">
                    {u.ativo ? "Desativar" : "Reativar"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <input className={campo} placeholder="Nome do novo grupo" value={novoGrupo} onChange={(e) => setNovoGrupo(e.target.value)} />
            <button onClick={criarGrupo} className={`${botao} w-full`}>Criar grupo</button>

            <ul className="pt-2">
              {grupos.map((g) => (
                <li key={g.id} className="flex items-center justify-between border-b border-slate-100 py-3">
                  <p className="text-[15px] font-bold text-[#1e2a78]">{g.nome}</p>
                  <div className="flex gap-3">
                    <button onClick={() => editarGrupo(g)} className="text-xs font-bold text-[#3d3fe8]">Editar</button>
                    <button onClick={() => setGrupos(grupos.filter((x) => x.id !== g.id))} className="text-xs font-bold text-red-600">Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}