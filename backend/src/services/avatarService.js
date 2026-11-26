import sharp from 'sharp';
import { executarComContextoRLS } from '../config/rlsContext.js';

export const MAX_AVATAR = 2 * 1024 * 1024;

export const TIPOS_AVATAR = [
    'image/jpeg',
    'image/png',
    'image/webp'
];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function falha(status, mensagem) {
    return Object.assign(new Error(mensagem), { status });
}

export function validarFoto(bytes, mime) {
    if (!Buffer.isBuffer(bytes) || !bytes.length) {
        throw falha(400, 'Foto obrigatoria.');
    }

    if (bytes.length > MAX_AVATAR) {
        throw falha(413, 'Foto acima de 2 MB.');
    }

    const jpeg = bytes.length >= 4
        && bytes[0] === 255
        && bytes[1] === 216
        && bytes[2] === 255
        && bytes.at(-2) === 255
        && bytes.at(-1) === 217;

    const png = bytes.length >= 20
        && bytes.subarray(0, 8).equals(
            Buffer.from([137,80,78,71,13,10,26,10])
        );

    const webp = bytes.length >= 16
        && bytes.subarray(0, 4).toString() === 'RIFF'
        && bytes.subarray(8, 12).toString() === 'WEBP';

    if (!(
        (mime === 'image/jpeg' && jpeg) ||
        (mime === 'image/png' && png) ||
        (mime === 'image/webp' && webp)
    )) {
        throw falha(415, 'Foto invalida.');
    }
}

async function autorizar(usuario, id) {
    if (!UUID.test(id)) {
        throw falha(404, 'Usuario nao encontrado.');
    }

    await executarComContextoRLS(usuario, async tx => {
        const alvo = await tx.user.findFirst({
            where: {
                id,
                companyId: usuario.companyId,
                status: 'ACTIVE'
            },
            select: { id: true }
        });

        if (!alvo) {
            throw falha(404, 'Usuario nao encontrado.');
        }
    });

    return 'profile-avatars/' + usuario.companyId + '/' + id;
}

async function storage(path, options = {}) {
    const base = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SECRET_KEY?.trim()
        || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!base || !key) {
        throw falha(503, 'Storage nao configurado.');
    }

    const url = new URL(base);

    if (url.protocol !== 'https:' || url.username ||
        url.password || url.search || url.hash ||
        url.pathname !== '/') {
        throw falha(503, 'Storage invalido.');
    }

    const headers = {
        ...options.headers,
        apikey: key
    };

    if (!key.startsWith('sb_secret_')) {
        headers.Authorization = 'Bearer ' + key;
    }

    let response;

    try {
        response = await fetch(
            url.origin + '/storage/v1/object/' + path,
            {
                ...options,
                headers,
                redirect: 'error',
                signal: AbortSignal.timeout(15000)
            }
        );
    } catch {
        throw falha(502, 'Falha de conexao com Storage.');
    }

    if (!response.ok) {
        const erro = await response.json().catch(() => ({}));

        if (response.status === 404 ||
            erro.statusCode === '404' ||
            erro.code === 'NoSuchKey') {
            throw falha(404, 'Foto nao encontrada.');
        }

        throw falha(502, 'Falha no armazenamento da foto.');
    }

    return response;
}

export async function processarFoto(bytes, mime) {
    validarFoto(bytes, mime);

    try {
        const imagem = sharp(bytes, {
            failOn: 'warning',
            limitInputPixels: 16000000
        });

        const meta = await imagem.metadata();

        const formatos = {
            'image/jpeg': 'jpeg',
            'image/png': 'png',
            'image/webp': 'webp'
        };

        if (meta.format !== formatos[mime] ||
            (meta.pages ?? 1) > 1) {
            throw new Error('Formato invalido.');
        }

        const resultado = await imagem
            .rotate()
            .resize(512, 512, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 85 })
            .toBuffer();

        if (resultado.length > MAX_AVATAR) {
            throw new Error('Imagem acima do limite.');
        }

        return resultado;
    } catch {
        throw falha(415, 'Imagem invalida ou corrompida.');
    }
}

export async function salvarAvatar(usuario, bytes, mime) {
    bytes = await processarFoto(bytes, mime); mime = "image/webp";

    const path = await autorizar(usuario, usuario.id);

    await storage(path, {
        method: 'POST',
        headers: {
            'Content-Type': mime,
            'x-upsert': 'true',
            'Cache-Control': 'no-cache'
        },
        body: bytes
    });
}

export async function consultarAvatar(usuario, id) {
    const path = await autorizar(usuario, id);

    const response = await storage('authenticated/' + path);

    const mime = response.headers.get('content-type')
        ?.split(';')[0].trim().toLowerCase();

    const bytes = Buffer.from(await response.arrayBuffer());

    validarFoto(bytes, mime);

    return { bytes, mime };
}

export async function removerAvatar(usuario) {
    const path = await autorizar(usuario, usuario.id);

    try {
        await storage(path, { method: 'DELETE' });
    } catch (error) {
        if (error.status !== 404) throw error;
    }
}
