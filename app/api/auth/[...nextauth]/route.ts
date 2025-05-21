// app\api\auth\[...nextauth]\route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email || "" },
                });

                if (!user || !credentials?.password || typeof user.passwordHash !== "string") return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!passwordMatch) return null;

                return user;

            },
        })
    ],
    session: { strategy: "database" },
    pages: {
        signIn: "/sign-in",
        newUser: "/register"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
