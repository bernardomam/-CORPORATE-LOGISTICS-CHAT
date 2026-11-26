


type OpcoesAPI = RequestInit & {
  token?: string | null;
};

export async function api(
  caminho: string,
  opcoes: OpcoesAPI = {}
) {

  const { token, headers, ...resto } = opcoes;

  const resposta = await fetch(caminho, {
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
      dados?.mensagem || dados?.message || "Erro ao comunicar com o servidor."
    );
  }

  return dados;
}
