import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default async function middleware(
    req: NextRequest,
    event: NextFetchEvent
) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    const response = NextResponse.next();
    // console.log(JSON.stringify(response));
    // Pengecualian untuk rute yang tidak memerlukan autentikasi
    // if (
    //     req.nextUrl.pathname.startsWith("/example-page") ||
    //     req.nextUrl.pathname.startsWith("/be-api") ||
    //     req.nextUrl.pathname.startsWith("/icon") ||
    //     req.nextUrl.pathname.startsWith("/images") ||
    //     req.nextUrl.pathname.startsWith("/prelogin")
    // ) {
    //     return NextResponse.next();
    // }

    if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const authMiddleware = await withAuth({
        pages: {
            signIn: `/login`,
        },
    });

    // @ts-expect-error
    return authMiddleware(req, event);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - login, api
         */
        "/((?!api|images|_next/static|_next/image|favicon.ico).*)",
    ],
};
