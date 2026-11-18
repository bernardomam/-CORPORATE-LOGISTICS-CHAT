
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma.js';

// Empresa à qual o administrador de TI pertence.
const empresaId = '796ea931-87a4-472c-a324-ca5be27604cd';

async function criarAdministrador() {
    const senha = process.env.ADMIN_PASSWORD;

    if (!senha || senha.length < 12) {
        throw new Error(
            'A senha deve possuir pelo menos 12 caracteres.'
        );
    }

    // Impedir a criação de outro administrador inicial.
    const totalUsuarios = await prisma.user.count();

    if (totalUsuarios > 0) {
        throw new Error(
            'Já existem usuários cadastrados. Criação inicial cancelada.'
        );
    }

    // Verificar se a empresa existe e está ativa.
    const empresa = await prisma.company.findUnique({
        where: {
            id: empresaId
        }
    });

    if (!empresa || empresa.status !== 'ACTIVE') {
        throw new Error(
            'Empresa não encontrada ou inativa.'
        );
    }

    // Criptografar a senha.
    const passwordHash = await bcrypt.hash(senha, 12);

    // Criar o administrador de TI.
    const administrador = await prisma.user.create({
        data: {
            name: 'João Gabriel',
            email: 'gabrielsouza.o.oliveira24@gmail.com',
            passwordHash,
            role: 'IT_ADMIN',
            status: 'ACTIVE',
            companyId: empresaId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            companyId: true
        }
    });

    console.log('Administrador criado com sucesso:');
    console.log(administrador);
}

criarAdministrador()
    .catch((error) => {
        console.error('Erro ao criar administrador:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
