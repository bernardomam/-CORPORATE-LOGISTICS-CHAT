import { prisma } from './src/config/prisma.js';

try {
    const u = await prisma.user.findUnique({
        where: {
            email: 'ti.teste.permissoes@calzup.test'
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            passwordHash: true,
            company: {
                select: {
                    status: true
                }
            }
        }
    });

    console.log(
        u
            ? {
                id: u.id,
                email: u.email,
                role: u.role,
                status: u.status,
                empresa: u.company.status,
                hashExiste: !!u.passwordHash,
                hashFormato: u.passwordHash?.startsWith('$2'),
                tamanhoHash: u.passwordHash?.length
            }
            : 'USUARIO NAO ENCONTRADO'
    );
} finally {
    await prisma.$disconnect();
}
