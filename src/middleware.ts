import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
    return NextResponse.next();
}

// export async function middleware(req: Request) {
//     const token = req.headers.get('Authorization') || req.cookies.get('token')?.value;

//     if (!token) {
//         return NextResponse.redirect(new URL('/acessar', req.url));
//     }

//     const res = await fetch(`${process.env.AUTH_API_URL}/validate-token`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` },
//     });

//     if (!res.ok) {
//         return NextResponse.redirect(new URL('/acessar', req.url));
//     }

//     return NextResponse.next();
// }

export const config = {
    matcher: ['/:path*'],
    // matcher: ['/dashboard/:path*', '/perfil/:path*'],
};