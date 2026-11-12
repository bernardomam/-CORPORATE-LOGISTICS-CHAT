
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma.js';

const empresaId = '796ea931-87a4-472c-a324-ca5be27604cd';

async function criarAdministrador() {
    try {
        const senha = process.env.ADMIN_PASSWORD;

        if (!senha || senha.length < 12) {
            throw new Error('A senha deve ter pelo menos 12 caracteres.');
        }

        const quantidade = await prisma.user.count();

        if (quantidade > 0) {
            throw new Error(
                'Já existem usuários cadastrados. Cadastro inicial bloqueado.'
            );
        }

        const empresa = await prisma.company.findUnique({
            where: { id: empresaId }
        });

        if (!empresa || empresa.status !== 'ACTIVE') {
            throw new Error('Empresa não encontrada ou inativa.');
        }

        const passwordHash = await bcrypt.hash(senha, 12);

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

        console.log('Administrador criado com sucesso!');
        console.log(administrador);

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

criarAdministrador();