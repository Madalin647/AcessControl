import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {

  console.log('middleware run')

       const token = request.cookies.get('token')?.value

       if(!process.env.JWT_SECRET){
        return NextResponse.json(
          { error: "JWT_SECRET not defined" },
          { status: 401 } )
       }

       if(!token){
        return NextResponse.json({status:401})
       }
      try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
  
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', String(payload.id))
    
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    
  } catch (err) {
    console.error('🔴 JWT verification failed:', err)
    return NextResponse.json(
      { message: "Cannot validate your token" },
      { status: 401 }
    )
  }

}

export const config = {
  matcher: ['/api/account/:path*']
}
