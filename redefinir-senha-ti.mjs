import bcrypt from 'bcryptjs';
import { prisma } from './src/config/prisma.js';

try {
    const email = 'ti.teste.permissoes@calzup.test';
    const senha = process.env.CALZUP_NEW_PASSWORD;

    if (!senha || senha.length < 12) {
        throw new Error('A senha precisa ter pelo menos 12 caracteres.');
    }

    const usuario = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, status: true }
    });

    if (!usuario || usuario.role !== 'IT_ADMIN' || usuario.status !== 'ACTIVE') {
        throw new Error('Conta de TI não encontrada ou não está ativa.');
    }

    const passwordHash = await bcrypt.hash(senha, 12);

    await prisma.user.update({
        where: { email },
        data: { passwordHash }
    });

    const atualizado = await prisma.user.findUnique({
        where: { email },
        select: { passwordHash: true }
    });

    const confirmado = await bcrypt.compare(senha, atualizado.passwordHash);

    console.log('Senha redefinida e verificada:', confirmado);
} finally {
    await prisma.$disconnect();
}
