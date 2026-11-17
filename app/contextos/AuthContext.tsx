
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Perfil = "USER" | "IT_ADMIN";

export type Usuario = {
  id: string;
  name: string;
  email: string;
  role: Perfil;
};

type AuthContextType = {
  usuario: Usuario | null;
  autenticado: boolean;
  carregandoAuth: boolean;
  entrar: (usuario: Usuario) => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CHAVE_SESSAO = "callzup_usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_SESSAO);

      if (salvo) {
        const dados = JSON.parse(salvo);

        if (
          dados.id &&
          dados.name &&
          dados.email &&
          ["USER", "IT_ADMIN"].includes(dados.role)
        ) {
          setUsuario(dados);
        } else {
          sessionStorage.removeItem(CHAVE_SESSAO);
        }
      }
    } catch {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } finally {
      setCarregandoAuth(false);
    }
  }, []);

  function entrar(novoUsuario: Usuario) {
    setUsuario(novoUsuario);

    try {
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(novoUsuario));
    } catch {}
  }

  function sair() {
    setUsuario(null);

    try {
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {}
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: usuario !== null,
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