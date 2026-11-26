
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../lib/api";

export type Perfil = "USER" | "IT_ADMIN";

export type Usuario = {
  id: string;
  name: string;
  email: string;
  role: Perfil;
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  autenticado: boolean;
  carregandoAuth: boolean;
  entrar: (usuario: Usuario, token?: string) => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CHAVE_SESSAO = "callzup_usuario";
const CHAVE_TOKEN = "callzup_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);
      const tokenSalvo = sessionStorage.getItem(CHAVE_TOKEN);

      if (salvo && tokenSalvo) {
        const dados = JSON.parse(salvo);

        if (
          dados.id &&
          dados.name &&
          dados.email &&
          ["USER", "IT_ADMIN"].includes(dados.role)
        ) {
          setUsuario(dados);
          setToken(tokenSalvo);
        } else {
          sessionStorage.removeItem(CHAVE_SESSAO);
          sessionStorage.removeItem(CHAVE_TOKEN);
        }
      } else {
        sessionStorage.removeItem(CHAVE_SESSAO);
        sessionStorage.removeItem(CHAVE_TOKEN);
      }
    } catch {
      sessionStorage.removeItem(CHAVE_SESSAO);
      sessionStorage.removeItem(CHAVE_TOKEN);
    } finally {
      setCarregandoAuth(false);
    }
  }, []);

  function entrar(novoUsuario: Usuario, novoToken?: string) {
    if (!novoToken) {
      sair();
      return;
    }

    setUsuario(novoUsuario);
    setToken(novoToken);

    try {
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(novoUsuario));
      sessionStorage.setItem(CHAVE_TOKEN, novoToken);
    } catch {}
  }

  function sair() {
    const tokenAtual = token;
    if (tokenAtual) {
      void api("/api/auth/logout", { method: "POST", token: tokenAtual, keepalive: true }).catch(() => {
        console.error("Não foi possível confirmar a revogação da sessão no servidor.");
      });
    }
    setUsuario(null);
    setToken(null);

    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
      sessionStorage.removeItem(CHAVE_TOKEN);
      sessionStorage.removeItem("callzup_login_pendente");
    } catch {}
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: usuario !== null && token !== null,
        carregandoAuth,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return contexto;
}
