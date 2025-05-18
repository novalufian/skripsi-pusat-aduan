import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const usersWithoutLogin = await prisma.user.findMany({
            where: {
                login: {
                    is: null
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(usersWithoutLogin);

    } catch (error: unknown) {
        console.error('Error fetching users without login data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users without login data' },
            { status: 500 }
        );
    }
}
