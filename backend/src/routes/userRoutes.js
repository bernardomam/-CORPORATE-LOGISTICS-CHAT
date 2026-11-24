
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

import { consultarUsuario, atualizarUsuario, reativarUsuario } from '../services/userService.js';
import { responderFalha } from '../utils/adminValidation.js';
const router = Router();

// ==========================================
// PROTEÇÃO DAS ROTAS DE USUÁRIOS
// ==========================================

// Todas as rotas abaixo exigem:
// 1. JWT válido
// 2. Usuário ativo
// 3. Empresa ativa
// 4. Perfil IT_ADMIN
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

router.get('/:id',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await consultarUsuario(req.params.id,req.user)});}catch(e){return responderFalha(e,res,next);}});
router.patch('/:id',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await atualizarUsuario(req.params.id,req.body,req.user)});}catch(e){return responderFalha(e,res,next);}});
router.patch('/:id/reativar',async(req,res,next)=>{try{return res.json({sucesso:true,usuario:await reativarUsuario(req.params.id,req.user)});}catch(e){return responderFalha(e,res,next);}});
export default router;
