"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../contextos/AuthContext";

export default function PainelTI() {
  const { usuario, token, carregandoAuth, sair } = useAuth();
  const router = useRouter();

  const [funcionarios, setFuncionarios] = useState<{id:string;name:string;status:string}[]>([]);
  const [alvo,setAlvo] = useState("");
  const [senha,setSenha] = useState("");
  const [aviso,setAviso] = useState("");
  const [ocupado,setOcupado] = useState(false);
  useEffect(() => {
    if (!token || usuario?.role !== "IT_ADMIN") return;
    let ativo = true;
    api("/api/users",{token}).then(d => { if(ativo) setFuncionarios((d.usuarios ?? []).filter((u:{status:string})=>u.status==="ACTIVE")); }).catch(e=>{if(ativo)setAviso(e.message);});
    return ()=>{ativo=false;};
  },[token,usuario?.role]);
  async function redefinir(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !alvo || ocupado) return;
    setOcupado(true); setAviso("");
    try {
      await api("/api/users/"+encodeURIComponent(alvo)+"/password",{token,method:"PATCH",body:JSON.stringify({newPassword:senha})});
      setAviso("Senha redefinida. Sessões anteriores revogadas.");
      if(alvo===usuario?.id){sair();router.replace("/login");}
    } catch(e){setAviso(e instanceof Error?e.message:"Falha ao redefinir senha.");}
    finally{setSenha("");setOcupado(false);}
  }

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
        <form onSubmit={redefinir} className="mt-5 rounded-2xl border bg-white p-5 flex flex-col gap-3">
          <h2 className="font-bold text-[#1e2a78]">Redefinir senha</h2>
          <label htmlFor="funcionario">Funcionário ativo</label>
          <select id="funcionario" required value={alvo} onChange={e=>setAlvo(e.target.value)} className="border rounded p-2"><option value="">Selecione</option>{funcionarios.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
          <label htmlFor="nova-senha">Nova senha</label>
          <input id="nova-senha" type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={senha} onChange={e=>setSenha(e.target.value)} className="border rounded p-2"/>
          <button disabled={ocupado || !alvo} className="rounded-xl bg-indigo-600 p-3 text-white disabled:opacity-50">{ocupado?"Salvando...":"Redefinir senha"}</button>
          <p role="status" className="text-sm">{aviso}</p>
        </form>
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
