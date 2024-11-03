import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const body = {
                    email: credentials?.email!,
                    password: credentials?.password!,
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_DEV}/api/auth/login`, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log("Response status:", res.status);

                const result = await res.json();
                console.log("Login response data:", result);

                if (res.ok && result.status === "success" && result.data) {
                    const { username, email, token } = result.data;
                    return { id: email, name: username, email, token };
                } else {
                    console.log("Login failed:", result.error || "Invalid credentials");
                    throw new Error(result.error || "Invalid credentials");
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as UserSession
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl) || url.startsWith("/")) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);