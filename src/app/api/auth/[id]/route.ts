import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function GET(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
) {
    try {
            const id = (await params).id;
            const user = await prisma.login.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    username: true,
                    userId: true,
                    // Never select password here
                }
            })

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json(user)
        } catch (error:unknown) {
            console.error('Error fetching user:', error)
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            )
        }
}

export async function DELETE(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
) {

    const id = (await params).id;

    const user = await prisma.login.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({ message : 'data login berhasil dihapus', user }, { status: 200 });
}

export async function PUT(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition

) {
    const id = (await params).id;
    const { email, password, userId } = await request.json();

    const user = await prisma.login.update({
        where: {
            id: Number(id),
        },
        data: {
            username: email,
            userId: userId,
            password: password,
        },
    });

    return NextResponse.json({ message : 'data login berhasil diubah', user }, { status: 200 });
}
