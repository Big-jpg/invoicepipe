// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { PrismaClient } = await import("@prisma/client"); // lazy import
        const prisma = new PrismaClient();

        const { email, name, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, name, passwordHash },
        });

        return NextResponse.json({ user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error("[REGISTER]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
