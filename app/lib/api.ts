
const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

type OpcoesAPI = RequestInit & {
  token?: string | null;
};

export async function api(
  caminho: string,
  opcoes: OpcoesAPI = {}
) {
  if (!API_URL) {
    throw new Error("A variável NEXT_PUBLIC_API_URL não está configurada.");
  }

  const { token, headers, ...resto } = opcoes;

  const resposta = await fetch(`${API_URL}/${caminho.replace(/^\/+/, '')}`, {
    ...resto,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      dados?.mensagem || dados?.message || (resposta.status >= 500 ? "Servidor temporariamente indisponível. Tente novamente mais tarde." : "Erro ao comunicar com o servidor.")
    );
  }

  return dados;
}
