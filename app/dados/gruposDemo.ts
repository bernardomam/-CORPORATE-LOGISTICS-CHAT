
export type Participante = {
  id: string;
  nome: string;
  foto?: string;
};

export const gruposDemo = [
  {
    id: 1,
    nome: "Equipe Logística",
    mensagem: "Grupo de teste",
    hora: "09:15",
    naoLidas: 2,
    cor: "bg-sky-500",
    participantes: [
      { id: "usuario-1", nome: "Lucas" },
      { id: "usuario-2", nome: "Ana" },
      { id: "usuario-3", nome: "Carlos" },
    ],
  },
];
