"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contextos/AuthContext";

export default function AvatarContato({ id, nome, className }: { id?: string; nome: string; className: string }) {
  const { token } = useAuth();
  const [foto, setFoto] = useState<{ id: string; token: string; url: string } | null>(null);
  useEffect(() => {
    if (!id || !token) return;
    const controller = new AbortController();
    let url: string | undefined;
    void (async () => {
      try {
        const resposta = await fetch("/api/users/" + encodeURIComponent(id) + "/avatar", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!resposta.ok) return;
        const blob = await resposta.blob();
        if (controller.signal.aborted || !blob.type.startsWith("image/")) return;
        url = URL.createObjectURL(blob);
        setFoto({ id, token, url });
      } catch { /* Sem foto: manter iniciais. */ }
    })();
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, token]);
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join("");
  const url = foto && foto.id === id && foto.token === token ? foto.url : null;
  return (
    <div className={className + " relative overflow-hidden"}>
      {iniciais || "U"}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={"Foto de " + nome} className="absolute inset-0 h-full w-full object-cover" onError={() => setFoto(null)} />
      )}
    </div>
  );
}
