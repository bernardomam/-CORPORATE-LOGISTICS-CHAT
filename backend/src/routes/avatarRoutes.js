import express from 'express';
import { autenticarToken } from '../middlewares/authMiddleware.js';
import {
    MAX_AVATAR,
    TIPOS_AVATAR,
    salvarAvatar,
    consultarAvatar,
    removerAvatar
} from '../services/avatarService.js';

const router = express.Router();

router.put('/me/avatar', autenticarToken,
    express.raw({ type: TIPOS_AVATAR, limit: MAX_AVATAR }),
    async (req, res, next) => {
        try {
            const mime = req.headers['content-type']
                ?.split(';')[0].trim().toLowerCase();

            await salvarAvatar(req.user, req.body, mime);

            res.json({
                sucesso: true,
                mensagem: 'Foto atualizada.',
                avatarUrl: '/api/users/' + req.user.id + '/avatar'
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id/avatar', autenticarToken, async (req, res, next) => {
    try {
        const { bytes, mime } = await consultarAvatar(
            req.user, req.params.id
        );

        res.set({
            'Content-Type': mime,
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff'
        });

        res.send(bytes);
    } catch (error) {
        next(error);
    }
});

router.delete('/me/avatar', autenticarToken, async (req, res, next) => {
    try {
        await removerAvatar(req.user);
        res.json({ sucesso: true, mensagem: 'Foto removida.' });
    } catch (error) {
        next(error);
    }
});

export default router;
