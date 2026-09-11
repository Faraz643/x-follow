import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  username: z.string().trim().regex(/^@?[A-Za-z0-9_]{1,15}$/),
  displayName: z.string().trim().min(1).max(80),
  bio: z.string().trim().max(280).optional().default(''),
  profileImageUrl: z.string().optional().default(''),
  categoryId: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const p=req.nextUrl.searchParams,q=p.get('q')?.trim()||'',category=p.get('category')||undefined,take=Math.min(Math.max(Number(p.get('limit')||24),1),50)
  const accounts=await prisma.xAccount.findMany({where:{active:true,...(category?{categories:{some:{category:{slug:category}}}}:{}),...(q?{OR:[{username:{contains:q.replace(/^@/,''),mode:'insensitive'}},{displayName:{contains:q,mode:'insensitive'}},{bio:{contains:q,mode:'insensitive'}}]}:{})},include:{categories:{include:{category:true}}},orderBy:{createdAt:'desc'},take})
  return NextResponse.json(accounts)
}

export async function POST(req:NextRequest){
  const parsed=schema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:'Please enter a valid username, name and category.'},{status:400})
  const data=parsed.data,handle=data.username.replace(/^@/,'').toLowerCase(),profileUrl=`https://x.com/${handle}`
  if(data.profileImageUrl && !data.profileImageUrl.startsWith('data:image/'))return NextResponse.json({error:'Profile picture must be selected from your device.'},{status:400})
  if(data.profileImageUrl.length>5_000_000)return NextResponse.json({error:'Profile picture is too large.'},{status:400})
  const category=await prisma.category.findUnique({where:{id:data.categoryId}}); if(!category)return NextResponse.json({error:'Category not found.'},{status:404})
  const user=await prisma.user.upsert({where:{email:`${handle}@x-follow.local`},update:{name:data.displayName},create:{email:`${handle}@x-follow.local`,name:data.displayName}})
  const account=await prisma.xAccount.upsert({where:{username:handle},update:{displayName:data.displayName,bio:data.bio||null,profileImageUrl:data.profileImageUrl||null,profileUrl,active:true},create:{xUserId:`manual:${handle}`,username:handle,displayName:data.displayName,bio:data.bio||null,profileImageUrl:data.profileImageUrl||null,profileUrl,submittedById:user.id}})
  await prisma.accountCategory.upsert({where:{accountId_categoryId:{accountId:account.id,categoryId:category.id}},update:{},create:{accountId:account.id,categoryId:category.id}})
  await prisma.submission.upsert({where:{userId_accountId:{userId:user.id,accountId:account.id}},update:{categoryId:category.id},create:{userId:user.id,accountId:account.id,categoryId:category.id}})
  return NextResponse.json(account,{status:201})
}
