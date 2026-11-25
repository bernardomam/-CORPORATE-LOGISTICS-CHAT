
import { executarComContextoRLS } from '../config/rlsContext.js';

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

function criarErro(mensagem, status = 400) {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

// ==========================================
// VALIDAÇÕES DE SEGURANÇA
// ==========================================

function validarAdministrador(usuario) {
    if (
        !usuario ||
        typeof usuario.id !== 'string' ||
        !usuario.id.trim() ||
        typeof usuario.companyId !== 'string' ||
        !usuario.companyId.trim()
    ) {
        throw criarErro(
            'Usuário não autenticado.',
            401
        );
    }

    if (usuario.role !== 'IT_ADMIN') {
        throw criarErro(
            'Acesso permitido somente à equipe de TI.',
            403
        );
    }
}

function validarId(id, mensagem) {
    if (
        typeof id !== 'string' ||
        !id.trim() ||
        id.length > 255
    ) {
        throw criarErro(mensagem);
    }

    return id.trim();
}

function validarNome(name) {
    if (
        typeof name !== 'string' ||
        !name.trim()
    ) {
        throw criarErro(
            'O nome do grupo é obrigatório.'
        );
    }

    const nome = name.trim();

    if (nome.length > 150) {
        throw criarErro(
            'O nome do grupo é muito longo.'
        );
    }

    return nome;
}

function validarDados(dados) {
    if (
        !dados ||
        typeof dados !== 'object' ||
        Array.isArray(dados)
    ) {
        throw criarErro(
            'Os dados informados são inválidos.'
        );
    }

    return dados;
}

// ==========================================
// CAMPOS DE RETORNO DOS INTEGRANTES
// ==========================================

const integrantesAtivos = {
    where: {
        leftAt: null
    },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                status: true
            }
        }
    }
};

// ==========================================
// BUSCAR GRUPO DA EMPRESA
// ==========================================

async function buscarGrupo(tx, usuario, id) {
    validarAdministrador(usuario);

    const grupoId = validarId(
        id,
        'Identificador do grupo inválido.'
    );

    const grupo = await tx.group.findFirst({
        where: {
            id: grupoId,
            companyId: usuario.companyId
        }
    });

    if (!grupo) {
        throw criarErro(
            'Grupo não encontrado nesta empresa.',
            404
        );
    }

    return grupo;
}

// ==========================================
// BUSCAR GRUPO ATIVO
// ==========================================

async function buscarGrupoAtivo(tx, usuario, id) {
    const grupo = await buscarGrupo(tx, usuario, id);

    if (grupo.status !== 'ACTIVE') {
        throw criarErro(
            'Este grupo está desativado.',
            409
        );
    }

    return grupo;
}

// ==========================================
// BUSCAR GRUPO COM INTEGRANTES
// ==========================================

async function buscarGrupoComIntegrantes(tx, usuario, id) {
    validarAdministrador(usuario);

    const grupoId = validarId(
        id,
        'Identificador do grupo inválido.'
    );

    return tx.group.findFirst({
        where: {
            id: grupoId,
            companyId: usuario.companyId
        },
        include: {
            members: integrantesAtivos
        }
    });
}

// ==========================================
// CRIAR GRUPO
// ==========================================

export async function criarGrupoInterno(tx, usuario, dados = {}) {
    validarAdministrador(usuario);
    validarDados(dados);

    const { name, memberIds = [] } = dados;
    const nome = validarNome(name);

    if (!Array.isArray(memberIds)) {
        throw criarErro(
            'A lista de participantes é inválida.'
        );
    }

    if (memberIds.length > 500) {
        throw criarErro(
            'A lista de participantes excede o limite permitido.'
        );
    }

    const participantes = [
        ...new Set(
            memberIds.map((id) =>
                validarId(
                    id,
                    'Existe um identificador de participante inválido.'
                )
            )
        )
    ];

    if (participantes.length > 0) {
        const usuariosValidos = await tx.user.findMany({
            where: {
                id: {
                    in: participantes
                },
                companyId: usuario.companyId,
                status: 'ACTIVE'
            },
            select: {
                id: true
            }
        });

        if (usuariosValidos.length !== participantes.length) {
            throw criarErro(
                'Um ou mais participantes são inválidos, estão inativos ou pertencem a outra empresa.'
            );
        }
    }

    try {
        return await tx.group.create({
            data: {
                name: nome,
                companyId: usuario.companyId,
                status: 'ACTIVE',
                members: {
                    create: participantes.map((userId) => ({
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }))
                }
            },
            include: {
                members: integrantesAtivos
            }
        });
    } catch (error) {
        if (error?.code === 'P2002') {
            throw criarErro(
                'Já existe um grupo com esse nome nesta empresa.',
                409
            );
        }

        throw error;
    }
}

// ==========================================
// LISTAR GRUPOS
// ==========================================

async function listarGruposInterno(tx, usuario) {
    validarAdministrador(usuario);

    return tx.group.findMany({
        where: {
            companyId: usuario.companyId
        },
        include: {
            members: integrantesAtivos
        },
        orderBy: {
            name: 'asc'
        }
    });
}

// ==========================================
// ATUALIZAR GRUPO
// ==========================================

async function atualizarGrupoInterno(
    tx,
    usuario,
    id,
    dados = {}
) {
    validarAdministrador(usuario);
    validarDados(dados);

    const grupo = await buscarGrupoAtivo(tx, usuario, id);
    const nome = validarNome(dados.name);

    try {
        const resultado = await tx.group.updateMany({
            where: {
                id: grupo.id,
                companyId: usuario.companyId,
                status: 'ACTIVE'
            },
            data: {
                name: nome
            }
        });

        if (resultado.count !== 1) {
            throw criarErro(
                'O grupo não está mais ativo.',
                409
            );
        }

        return buscarGrupoComIntegrantes(
            tx,
            usuario,
            grupo.id
        );
    } catch (error) {
        if (error?.code === 'P2002') {
            throw criarErro(
                'Já existe um grupo com esse nome nesta empresa.',
                409
            );
        }

        throw error;
    }
}

// ==========================================
// ADICIONAR INTEGRANTE
// ==========================================

async function adicionarIntegranteInterno(
    tx,
    usuario,
    grupoId,
    userId
) {
    validarAdministrador(usuario);

    const grupo = await buscarGrupoAtivo(
        tx,
        usuario,
        grupoId
    );

    const participanteId = validarId(
        userId,
        'O identificador do usuário é obrigatório.'
    );

    const participante = await tx.user.findFirst({
        where: {
            id: participanteId,
            companyId: usuario.companyId,
            status: 'ACTIVE'
        },
        select: {
            id: true
        }
    });

    if (!participante) {
        throw criarErro(
            'Usuário não encontrado, inativo ou pertencente a outra empresa.',
            404
        );
    }

    const participacaoAtiva =
        await tx.groupMember.findFirst({
            where: {
                groupId: grupo.id,
                userId: participante.id,
                leftAt: null
            },
            select: {
                id: true
            }
        });

    if (participacaoAtiva) {
        throw criarErro(
            'Este usuário já participa do grupo.',
            409
        );
    }

    try {
        await tx.groupMember.create({
            data: {
                groupId: grupo.id,
                userId: participante.id
            }
        });

        return buscarGrupoComIntegrantes(
            tx,
            usuario,
            grupo.id
        );
    } catch (error) {
        if (error?.code === 'P2002') {
            throw criarErro(
                'Não foi possível criar uma nova participação para este usuário.',
                409
            );
        }

        throw error;
    }
}

// ==========================================
// REMOVER INTEGRANTE
// ==========================================

async function removerIntegranteInterno(
    tx,
    usuario,
    grupoId,
    userId
) {
    validarAdministrador(usuario);

    const grupo = await buscarGrupoAtivo(
        tx,
        usuario,
        grupoId
    );

    const participanteId = validarId(
        userId,
        'O identificador do usuário é obrigatório.'
    );

    const agora = new Date();

    const resultado = await tx.groupMember.updateMany({
        where: {
            groupId: grupo.id,
            userId: participanteId,
            leftAt: null
        },
        data: {
            leftAt: agora
        }
    });

    if (resultado.count === 0) {
        throw criarErro(
            'Este usuário não participa atualmente do grupo.',
            404
        );
    }

    return {
        grupoId: grupo.id,
        userId: participanteId,
        leftAt: agora
    };
}

// ==========================================
// DESATIVAR GRUPO
// ==========================================

async function desativarGrupoInterno(tx, usuario, id) {
    validarAdministrador(usuario);

    const grupo = await buscarGrupoAtivo(tx, usuario, id);

    const resultado = await tx.group.updateMany({
        where: {
            id: grupo.id,
            companyId: usuario.companyId,
            status: 'ACTIVE'
        },
        data: {
            status: 'INACTIVE'
        }
    });

    if (resultado.count !== 1) {
        throw criarErro(
            'O grupo já está desativado.',
            409
        );
    }

    return tx.group.findFirst({
        where: {
            id: grupo.id,
            companyId: usuario.companyId
        },
        select: {
            id: true,
            name: true,
            companyId: true,
            status: true,
            createdAt: true
        }
    });
}

// ==========================================
// FUNÇÕES PÚBLICAS COM CONTEXTO RLS
// ==========================================

export async function criarGrupo(usuario, dados = {}) {
    return executarComContextoRLS(usuario, (tx) =>
        criarGrupoInterno(tx, usuario, dados)
    );
}

export async function listarGrupos(usuario) {
    return executarComContextoRLS(usuario, (tx) =>
        listarGruposInterno(tx, usuario)
    );
}

export async function atualizarGrupo(usuario, id, dados = {}) {
    return executarComContextoRLS(usuario, (tx) =>
        atualizarGrupoInterno(tx, usuario, id, dados)
    );
}

export async function adicionarIntegrante(
    usuario,
    grupoId,
    userId
) {
    return executarComContextoRLS(usuario, (tx) =>
        adicionarIntegranteInterno(
            tx,
            usuario,
            grupoId,
            userId
        )
    );
}

export async function removerIntegrante(
    usuario,
    grupoId,
    userId
) {
    return executarComContextoRLS(usuario, (tx) =>
        removerIntegranteInterno(
            tx,
            usuario,
            grupoId,
            userId
        )
    );
}

export async function desativarGrupo(usuario, id) {
    return executarComContextoRLS(usuario, (tx) =>
        desativarGrupoInterno(tx, usuario, id)
    );
}
