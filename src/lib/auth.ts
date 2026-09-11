import { SignJWT, jwtVerify } from 'jose'
const secret=()=>new TextEncoder().encode(process.env.AUTH_SECRET||'development-only-change-me')
export async function createSession(userId:string){return new SignJWT({sub:userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(secret())}
export async function getSessionUserId(cookie?:string){if(!cookie)return null;try{return (await jwtVerify(cookie,secret())).payload.sub||null}catch{return null}}
