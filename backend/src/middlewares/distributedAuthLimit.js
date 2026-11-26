import {createHmac} from 'node:crypto';
import {prisma} from '../config/prisma.js';
import {chaveJWT} from '../utils/authValidation.js';
export async function limitarAuth(req,res,next){
 try{
 const identity=req.user?.id || req.ip || req.socket.remoteAddress || 'unknown';
 // Remove expired buckets opportunistically; no raw IP is stored.
 await prisma.$executeRaw`DELETE FROM "AuthAttempt" WHERE "expiresAt" < now() - interval '1 hour'`;
 const key=createHmac('sha256',chaveJWT()).update('auth-limit:'+identity).digest('hex');
 const rows=await prisma.$queryRaw`INSERT INTO "AuthAttempt" (key,count,"expiresAt") VALUES (${key},1,now()+interval '15 minutes')
 ON CONFLICT (key) DO UPDATE SET count=CASE WHEN "AuthAttempt"."expiresAt"<=now() THEN 1 ELSE LEAST("AuthAttempt".count+1,11) END,
 "expiresAt"=CASE WHEN "AuthAttempt"."expiresAt"<=now() THEN now()+interval '15 minutes' ELSE "AuthAttempt"."expiresAt" END RETURNING count,"expiresAt"`;
 if(rows[0].count>10){res.set('Retry-After',String(Math.max(1,Math.ceil((new Date(rows[0].expiresAt)-Date.now())/1000))));return res.status(429).json({sucesso:false,mensagem:'Muitas tentativas. Aguarde.'});}
 return next();
 }catch(e){
 if(e?.code==='P2010' && e?.meta?.code==='42P01') {
   console.error('AUTH_LIMIT_SCHEMA_MISSING');
   return res.status(503).json({sucesso:false,mensagem:'Autenticação temporariamente indisponível.'});
 }
 return next(e);
 }
}
