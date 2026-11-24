import { executarComContextoRLS } from '../config/rlsContext.js';
import { exigirAdministrador, validarId, validarNome, validarCorpo, falha } from '../utils/adminValidation.js';
const campos={id:true,name:true,companyId:true,createdAt:true};
export async function listarDepartamentos(user){
    exigirAdministrador(user);
    return executarComContextoRLS(user,tx=>tx.department.findMany({where:{companyId:user.companyId},select:campos,orderBy:{name:'asc'}}));
}
export async function consultarDepartamento(user,id){
    exigirAdministrador(user);validarId(id);
    return executarComContextoRLS(user,async tx=>{
        const d=await tx.department.findFirst({where:{id,companyId:user.companyId},select:campos});
        if(!d)throw falha(404,'Departamento não encontrado.');
        return d;
    });
}
export async function criarDepartamento(user,body){
    exigirAdministrador(user);validarCorpo(body,['name']);const name=validarNome(body.name);
    return executarComContextoRLS(user,tx=>tx.department.create({data:{name,companyId:user.companyId},select:campos}));
}
export async function atualizarDepartamento(user,id,body){
    exigirAdministrador(user);validarId(id);validarCorpo(body,['name']);const name=validarNome(body.name);
    return executarComContextoRLS(user,tx=>tx.department.update({where:{id,companyId:user.companyId},data:{name},select:campos}));
}
