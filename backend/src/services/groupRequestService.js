import { executarComContextoRLS } from '../config/rlsContext.js';
import { criarGrupoInterno } from './groupService.js';
import { validarId,validarNome,validarCorpo,exigirAdministrador,falha } from '../utils/adminValidation.js';
function auth(u){if(!u?.id||!u?.companyId)throw falha(401,'Usuário não autenticado.');}
export async function solicitarGrupo(u,body){
 auth(u);validarCorpo(body,['name','memberIds']);const name=validarNome(body.name);
 if(!Array.isArray(body.memberIds)||body.memberIds.length>499)throw falha(400,'Lista de integrantes inválida.');
 const memberIds=[...new Set([u.id,...body.memberIds.map(validarId)])];
 return executarComContextoRLS(u,async tx=>{
 if(await tx.user.count({where:{id:{in:memberIds},companyId:u.companyId,status:'ACTIVE'}})!==memberIds.length)throw falha(400,'Integrantes inválidos.');
 if(await tx.group.findFirst({where:{companyId:u.companyId,name:{equals:name,mode:'insensitive'}}}))throw falha(409,'Grupo já existente.');
 return tx.groupRequest.create({data:{companyId:u.companyId,requesterId:u.id,name,memberIds}});
 });
}
export async function listarPedidosGrupo(u,todos=false){
 auth(u);if(todos)exigirAdministrador(u);
 return executarComContextoRLS(u,tx=>tx.groupRequest.findMany({where:{companyId:u.companyId,...(todos?{}:{requesterId:u.id})},orderBy:{createdAt:'desc'}}));
}
export async function revisarPedidoGrupo(u,id,aprovar){
 exigirAdministrador(u);validarId(id);
 return executarComContextoRLS(u,async tx=>{
 const pedido=await tx.groupRequest.findFirst({where:{id,companyId:u.companyId}});
 if(!pedido)throw falha(404,'Solicitação não encontrada.');
 if(pedido.requesterId===u.id)throw falha(403,'Não pode analisar a própria solicitação.');
 const reserva=await tx.groupRequest.updateMany({where:{id,companyId:u.companyId,status:'PENDING'},data:{status:aprovar?'APPROVED':'REJECTED',reviewedById:u.id,reviewedAt:new Date()}});
 if(reserva.count!==1)throw falha(409,'Solicitação já analisada.');
 if(aprovar){
 const grupo=await criarGrupoInterno(tx,u,{name:pedido.name,memberIds:pedido.memberIds});
 // Link must be set while the request is still writable by the reviewer policy.
 await tx.groupRequest.update({where:{id},data:{groupId:grupo.id}});
 }
 return tx.groupRequest.findUnique({where:{id}});
 });
}
