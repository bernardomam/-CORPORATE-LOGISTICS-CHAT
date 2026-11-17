
import {
    listarMeusGrupos
} from '../services/myGroupService.js';

// Listar grupos dos quais o usuário participa
export async function listarMeusGruposController(req, res) {
    try {
        const grupos = await listarMeusGrupos(req.user);

        return res.status(200).json({
            sucesso: true,
            total: grupos.length,
            grupos
        });

    } catch (error) {
        const status =
            Number.isInteger(error?.status) &&
            error.status >= 400 &&
            error.status <= 599
                ? error.status
                : 500;

        if (status >= 500) {
            console.error(
                'Erro interno ao listar grupos do usuário:',
                error
            );

            return res.status(status).json({
                sucesso: false,
                mensagem: 'Erro interno do servidor.'
            });
        }

        return res.status(status).json({
            sucesso: false,
            mensagem:
                typeof error?.message === 'string' &&
                error.message.trim()
                    ? error.message
                    : 'Não foi possível listar seus grupos.'
        });
    }
}
