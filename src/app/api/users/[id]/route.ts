import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition

) {
    try {
        const id = (await params).id
        const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
            login: {
            select: {
                username: true
            }
            }
        }
        })

        if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
        )
        }

        return NextResponse.json(user)
    } catch (error : unknown) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
        )
    }
}

interface updateDataInterface {
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
}

export async function PUT(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition

    ) {
    try {
        const id = (await params).id

        const { nama, alamat, tempatLahir, tanggalLahir } = await request.json()

        const updateData: updateDataInterface = {
        nama,
        alamat,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir)
        }

        // Prepare login update if username or password changed

        const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,

        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
        )
    }
    }

    export async function DELETE(
        request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
    ) {
    try {
        const id = (await params).id
        await prisma.user.delete({
        where: { id: Number(id) }
        })

        return NextResponse.json(
        { message: 'User deleted successfully' },
        { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
        )
    }
}
