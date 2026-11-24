import { validarId, falha } from './adminValidation.js';
export function validarPaginacao(query={}){
    const {limit='50',before}=query;
    if(typeof limit!=='string'||!/^\d{1,3}$/.test(limit)||Number(limit)<1||Number(limit)>100)throw falha(400,'Limite deve estar entre 1 e 100.');
    return {limit:Number(limit),before:before===undefined?null:validarId(before)};
}
