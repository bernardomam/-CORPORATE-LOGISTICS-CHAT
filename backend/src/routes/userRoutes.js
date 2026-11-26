import avatarRoutes from './avatarRoutes.js';

import { Router } from 'express';

import {
    cadastrar,
    listar,
    desativar
} from '../controllers/userController.js';

import {
    autenticarToken,
    exigirTI
} from '../middlewares/authMiddleware.js';

import { consultarUsuario, atualizarUsuario, reativarUsuario, listarColegas } from '../services/userService.js';
import { responderFalha } from '../utils/adminValidation.js';
import { redefinirSenhaTI } from '../services/authService.js';
import { limitarAuth } from '../middlewares/distributedAuthLimit.js';
const router = Router();

// ==========================================
// PROTEÇÃO DAS ROTAS DE USUÁRIOS
// ==========================================

// Todas as rotas abaixo exigem:
// 1. JWT válido
// 2. Usuário ativo
// 3. Empresa ativa
// 4. Perfil IT_ADMIN
router.get('/colegas',autenticarToken,async(req,res,next)=>{try{const usuarios=await listarColegas(req.user);return res.json({sucesso:true,total:usuarios.length,usuarios});}catch(e){return responderFalha(e,res,next);}});
router.use(avatarRoutes);
router.use(autenticarToken, exigirTI);

// ==========================================
// ADMINISTRAÇÃO DE USUÁRIOS
// ==========================================

// Cadastrar usuário
router.post('/', cadastrar);

// Listar usuários
router.get('/', listar);

// Desativar usuário
router.patch('/:id/desativar', desativar);
router.patch('/:id/password', limitarAuth, async(req,res,next)=>{try{await redefinirSenhaTI(req.user,req.params.id,req.body?.newPassword);return res.json({sucesso:true,mensagem:'Senha redefinida e sessões revogadas.'});}catch(e){return responderFalha(e,res,next);}});

router.get('/:id',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await consultarUsuario(req.params.id,req.user)});}catch(e){return responderFalha(e,res,next);}});
router.patch('/:id',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await atualizarUsuario(req.params.id,req.body,req.user)});}catch(e){return responderFalha(e,res,next);}});
router.patch('/:id/reativar',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await reativarUsuario(req.params.id,req.user)});}catch(e){return responderFalha(e,res,next);}});
export default router;
