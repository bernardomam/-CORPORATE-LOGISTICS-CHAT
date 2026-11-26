import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { sessionVersion } from '../utils/sessionVersion.js';
import { chaveJWT as obterChaveJWT, senhaValida } from '../utils/authValidation.js';
import { falha } from '../utils/adminValidation.js';
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
    if (email.length > 254 || Buffer.byteLength(password, 'utf8') > 72) {
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
    const chaveJWT = obterChaveJWT();

    // Criar token JWT com validade de 8 horas.
    const sessionId = randomUUID();
    const token = jwt.sign(
        {
            jti: sessionId,
            companyId: usuario.companyId,
            role: usuario.role,
            sv: sessionVersion(usuario.passwordHash,chaveJWT)
        },
        chaveJWT,
        {
            algorithm: 'HS256',
            subject: usuario.id,
            expiresIn: '8h'
        }
    );

    const expiresAt = new Date(jwt.decode(token).exp * 1000);
    await prisma.$executeRaw`INSERT INTO public."AuthSession" ("id", "userId", "expiresAt") VALUES (${sessionId}::uuid, ${usuario.id}::uuid, ${expiresAt})`;

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

export async function alterarSenha(usuario, atual, nova){
    if(!usuario?.id || !usuario?.companyId) throw falha(401,'Usuário não autenticado.');
    if(typeof atual!=='string'||!atual||Buffer.byteLength(atual,'utf8')>72||!senhaValida(nova)||atual===nova) throw falha(400,'Informe uma senha atual e uma nova senha diferente, de 8 caracteres a 72 bytes.');
    const registro=await prisma.user.findFirst({where:{id:usuario.id,companyId:usuario.companyId,status:'ACTIVE',company:{status:'ACTIVE'}},select:{passwordHash:true}});
    if(!registro||!await bcrypt.compare(atual,registro.passwordHash)) throw falha(401,'Senha atual inválida.');
    const passwordHash=await bcrypt.hash(nova,12);
    const resultado=await prisma.user.updateMany({where:{id:usuario.id,companyId:usuario.companyId,status:'ACTIVE',passwordHash:registro.passwordHash,company:{status:'ACTIVE'}},data:{passwordHash}});
    if(resultado.count!==1) throw falha(409,'Conta alterada durante a operação. Tente novamente.');
}
