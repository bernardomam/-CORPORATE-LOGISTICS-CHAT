
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export async function autenticarUsuario(email, password) {
  if (!email || !password) {
    throw new Error('EMAIL_SENHA_OBRIGATORIOS');
  }

  const usuario = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase()
    },
    include: {
      company: {
        select: {
          status: true
        }
      }
    }
  });

  if (!usuario) {
    throw new Error('CREDENCIAIS_INVALIDAS');
  }

  if (usuario.status !== 'ACTIVE') {
    throw new Error('USUARIO_INATIVO');
  }

  if (usuario.company.status !== 'ACTIVE') {
    throw new Error('EMPRESA_INATIVA');
  }

  const senhaValida = await bcrypt.compare(
    password,
    usuario.passwordHash
  );

  if (!senhaValida) {
    throw new Error('CREDENCIAIS_INVALIDAS');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET_NAO_CONFIGURADO');
  }

  const token = jwt.sign(
    {
      companyId: usuario.companyId,
      role: usuario.role
    },
    process.env.JWT_SECRET,
    {
      subject: usuario.id,
      expiresIn: '8h'
    }
  );

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
