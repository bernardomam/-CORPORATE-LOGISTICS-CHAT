import express from 'express';
import { randomUUID } from 'node:crypto';
import { autenticarToken } from '../middlewares/authMiddleware.js';
import { executarComContextoRLS } from '../config/rlsContext.js';
import { verificarHorarioFuncionamento } from '../utils/horarioFuncionamento.js';

const router = express.Router();
const MAX = 4 * 1024 * 1024;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function fail(status, message) { throw Object.assign(new Error(message), {status}); }
export function validarArquivo(bytes, mime) {
    if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > MAX) fail(400,'Arquivo inválido ou acima de 4 MB.');
    const pdf = bytes.subarray(0,5).toString() === '%PDF-' && bytes.subarray(-1024).includes(Buffer.from('%%EOF'));
    const jpeg = bytes.length >= 4 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255 && bytes.at(-2)===255 && bytes.at(-1)===217;
    if (!(mime==='application/pdf' && pdf || mime==='image/jpeg' && jpeg)) fail(415,'Somente PDF e JPEG válidos.');
}
async function storage(path, options={}) {
    const base=process.env.SUPABASE_URL?.trim();
    const key=process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!base || !key) fail(503,'Armazenamento não configurado.');
    let origin;
    try {
        const url=new URL(base);
        if (url.protocol!=='https:' || url.username || url.password || url.search || url.hash || url.pathname!=='/') throw new Error();
        origin=url.origin;
    } catch { fail(503,'URL do armazenamento inválida.'); }
    const headers={...options.headers,apikey:key};
    if (key.startsWith('sb_secret_')) {
        // O gateway Supabase autentica chaves opacas pelo cabeçalho apikey.
    } else if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key)) {
        headers.Authorization='Bearer '+key;
    } else {
        console.error('Anexos: formato de credencial Storage inválido');
        fail(503,'Credencial de armazenamento inválida.');
    }
    let response;
    try {
        response=await fetch(origin+'/storage/v1/object/'+path,{...options,signal:AbortSignal.timeout(15000),headers});
    } catch {
        console.error('Anexos: falha de conexão com Storage');
        fail(502,'Falha na conexão com armazenamento.');
    }
    if (!response.ok) {
        console.error('Anexos: Storage HTTP',response.status);
        fail(502,'Falha no armazenamento.');
    }
    return response;
}
async function acesso(tx,user,kind,id) {
    if (!uuid.test(id) || !['grupo','privado'].includes(kind)) fail(400,'Conversa inválida.');
    const where={id,companyId:user.companyId,status:'ACTIVE',members:{some:{userId:user.id,...(kind==='grupo'?{leftAt:null}:{})}}};
    const row=kind==='grupo'?await tx.group.findFirst({where,select:{id:true}}):await tx.privateChat.findFirst({where,select:{id:true}});
    if (!row) fail(404,'Conversa não encontrada.');
}
router.use(autenticarToken);
router.post('/:kind/:id',express.raw({type:['application/pdf','image/jpeg'],limit:MAX}),async(req,res,next)=>{
    let uploaded=false, path, etapa='validacao';
    try {
        if (!verificarHorarioFuncionamento()) fail(403,'Fora do horário de envio.');
        const {kind,id}=req.params, user=req.user, mime=req.headers['content-type']?.split(';')[0].trim().toLowerCase();
        validarArquivo(req.body,mime);
        const nome=String(req.query.nome||'arquivo').replace(/[\x00-\x1f\x7f/\\]/g,'_').slice(0,150);
        const messageId=randomUUID();
        path='chat-attachments/'+user.companyId+'/'+messageId;
        etapa='permissao';
        await executarComContextoRLS(user,tx=>acesso(tx,user,kind,id));
        etapa='storage';
        await storage(path,{method:'POST',headers:{'Content-Type':mime,'x-upsert':'false'},body:req.body});
        uploaded=true;
        etapa='registro';
        await executarComContextoRLS(user,async tx=>{
            await acesso(tx,user,kind,id);
            if (!verificarHorarioFuncionamento()) fail(403,'Fora do horário de envio.');
            await tx.message.create({data:{id:messageId,companyId:user.companyId,userId:user.id,content:JSON.stringify({nome,mime,size:req.body.length}),type:mime==='application/pdf'?'FILE':'IMAGE',...(kind==='grupo'?{groupId:id}:{privateChatId:id})}});
            if(kind==='privado') await tx.privateChat.update({where:{id},data:{updatedAt:new Date()}});
        });
        res.status(201).json({sucesso:true,id:messageId});
    } catch(e) {
        if (!e.status || e.status>=500) console.error('Anexos: etapa',etapa,'codigo',e.code || e.name,'status',e.status || 500);
        if(uploaded) await storage(path,{method:'DELETE'}).catch(()=>console.error('Anexos: falha na limpeza do objeto'));
        next(e);
    }
});
router.get('/:messageId',async(req,res,next)=>{
    try {
        const id=req.params.messageId,user=req.user;
        if(!uuid.test(id)) fail(404,'Anexo não encontrado.');
        const m=await executarComContextoRLS(user,async tx=>{
            const row=await tx.message.findFirst({where:{id,companyId:user.companyId,type:{in:['FILE','IMAGE']}}});
            if(!row) fail(404,'Anexo não encontrado.');
            await acesso(tx,user,row.groupId?'grupo':'privado',row.groupId||row.privateChatId);
            return row;
        });
        const mime=m.type==='FILE'?'application/pdf':'image/jpeg';
        const response=await storage('authenticated/chat-attachments/'+user.companyId+'/'+id);
        const bytes=Buffer.from(await response.arrayBuffer());
        validarArquivo(bytes,mime);
        res.set({'Content-Type':mime,'Content-Disposition':'attachment; filename="anexo.'+(m.type==='FILE'?'pdf':'jpg')+'"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
        res.send(bytes);
    } catch(e){next(e);}
});
export default router;
