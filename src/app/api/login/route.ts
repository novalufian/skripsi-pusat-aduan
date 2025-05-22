import { serialize } from 'cookie'; // Import the 'serialize' function
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        // 1. Query the custom `login` table
        const loginData = await prisma.login.findUnique({
            where: { username: email },
        });

        if (!loginData) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
        }

        // 2. Directly compare the entered password
        if (loginData.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
        }

        // 3. Fetch user data
        const userData = await prisma.user.findUnique({
            where: { id: loginData.userId },
        });

        if (!userData) {
            return NextResponse.json({ error: 'Error fetching user data.' }, { status: 500 });
        }

        // 4. Set cookie
        const cookieValue = serialize('userSession', String(JSON.stringify(userData)), {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        const response = NextResponse.json({ user: userData }, { status: 200 });
        response.headers.set('Set-Cookie', cookieValue);

        return response;
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
