import {createHmac} from 'node:crypto';
export function sessionVersion(hash,key){return createHmac('sha256',key).update('session:'+hash).digest('hex');}
