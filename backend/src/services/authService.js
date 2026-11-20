import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import {
    verificarHorarioFuncionamento
} from '../utils/horarioFuncionamento.js';

// ==========================================
// AUTENTICAR USUÁRIO
// ==========================================

export async function autenticarUsuario(email, password) {
    // Verificar o horário permitido para login.
    if (!verificarHorarioFuncionamento()) {
        throw new Error('FORA_DO_HORARIO');
    }

    // Validar os dados recebidos.
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        email.trim().length === 0 ||
        password.length === 0
    ) {
        throw new Error('EMAIL_SENHA_OBRIGATORIOS');
    }

    // Limitar o tamanho das credenciais.
    if (email.length > 254 || password.length > 1024) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // Padronizar o e-mail.
    const emailNormalizado = email.trim().toLowerCase();

    // Consulta inicial de autenticação.
    //
    // Esta consulta ocorre antes de existir um usuário
    // autenticado, portanto não utiliza executarComContextoRLS.
    //
    // Antes de ativar RLS com um usuário PostgreSQL sem
    // BYPASSRLS, será necessário definir uma estratégia
    // segura para esta consulta inicial.
    const usuario = await prisma.user.findUnique({
        where: {
            email: emailNormalizado
        },
        select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
            companyId: true,
            departmentId: true,
            company: {
                select: {
                    status: true
                }
            }
        }
    });

    // Não revelar se o e-mail existe.
    if (!usuario) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // Comparar a senha informada com o hash armazenado.
    const senhaValida = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!senhaValida) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // Verificar se o usuário continua ativo.
    if (usuario.status !== 'ACTIVE') {
        throw new Error('USUARIO_INATIVO');
    }

    // Verificar se a empresa continua ativa.
    if (
        !usuario.company ||
        usuario.company.status !== 'ACTIVE'
    ) {
        throw new Error('EMPRESA_INATIVA');
    }

    // Verificar a configuração da chave JWT.
    const chaveJWT = process.env.JWT_SECRET;

    if (
        typeof chaveJWT !== 'string' ||
        chaveJWT.trim().length === 0
    ) {
        console.error('JWT_SECRET não configurado.');
        throw new Error('JWT_SECRET_NAO_CONFIGURADO');
    }

    // Criar token JWT com validade de 8 horas.
    const token = jwt.sign(
        {
            companyId: usuario.companyId,
            role: usuario.role
        },
        chaveJWT,
        {
            algorithm: 'HS256',
            subject: usuario.id,
            expiresIn: '8h'
        }
    );

    // Retornar token e dados públicos do usuário.
    // Nunca retornar passwordHash.
    return {
        token,
        usuario: {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
            status: usuario.status,
            companyId: usuario.companyId,
            departmentId: usuario.departmentId
        }
    };
}
