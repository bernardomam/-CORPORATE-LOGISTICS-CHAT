import bcrypt from 'bcryptjs';
import { prisma } from './src/config/prisma.js';

try {
    const usuario = await prisma.user.findUnique({
        where: {
            email: 'ti.teste.permissoes@calzup.test'
        },
        select: {
            passwordHash: true
        }
    });

    if (!usuario) {
        console.log('USUARIO NAO ENCONTRADO');
    } else {
        const corresponde = await bcrypt.compare(
            process.env.CALZUP_TEST_PASSWORD,
            usuario.passwordHash
        );

        console.log('Senha corresponde ao hash:', corresponde);
    }
} finally {
    await prisma.$disconnect();
}
