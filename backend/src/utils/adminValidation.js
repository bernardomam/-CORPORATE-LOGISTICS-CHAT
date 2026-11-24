export function falha(status,message){return Object.assign(new Error(message),{status});}
export function exigirAdministrador(user){
    if(!user?.id || !user?.companyId) throw falha(401,'Usuário não autenticado.');
    if(user.role !== 'IT_ADMIN') throw falha(403,'Acesso restrito à TI.');
}
export function validarId(id){
    if(typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw falha(400,'Identificador inválido.');
    return id;
}
export function validarNome(name){
    if(typeof name !== 'string' || !name.trim() || name.trim().length>150) throw falha(400,'Nome inválido.');
    return name.trim();
}
export function validarCorpo(body,allowed){
    if(!body || typeof body!=='object' || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some(k=>!allowed.includes(k))) throw falha(400,'Campos inválidos.');
}
export function responderFalha(error,res,next){
    if(error.code==='P2002') return res.status(409).json({sucesso:false,mensagem:'Registro duplicado.'});
    if(error.code==='P2025') return res.status(404).json({sucesso:false,mensagem:'Registro não encontrado.'});
    if(error.status>=400 && error.status<500) return res.status(error.status).json({sucesso:false,mensagem:error.message});
    return next(error);
}
