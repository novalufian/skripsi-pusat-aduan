import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { username, password, userId } = await request.json();

    const user = await prisma.login.create({
        data: {
            username: username,
            password: password,
            userId: userId,
        },
    });


    return NextResponse.json({ message : 'data login berhasil ditambahkan', user }, { status: 200 });
}

export async function GET() {
    const user = await prisma.login.findMany({
        orderBy: {
        createdAt: 'desc'
        }
    })

    return NextResponse.json(user)
}
