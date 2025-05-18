import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
    ) {
    try {
        const id = (await params).id;
        const aduan = await prisma.aduan.findUnique({
        where: { id: Number(id) }
        })

        if (!aduan) {
        return NextResponse.json(
            { error: 'Aduan not found' },
            { status: 404 }
        )
        }

        return NextResponse.json(aduan)
    } catch (error : unknown) {
        console.error('Error fetching aduan:', error)
        return NextResponse.json(
        { error: 'Failed to fetch aduan' },
        { status: 500 }
        )
    }
}

// UPDATE aduan
export async function PUT(
    request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
) {
    try {
        const id = (await params).id;
        const { judul, deskripsi } = await request.json()

        const updatedAduan = await prisma.aduan.update({
        where: { id: Number(id) },
        data: {
            judul,
            deskripsi
        }
        })

        return NextResponse.json(updatedAduan)
    } catch (error: unknown) {
        console.error('Error updating aduan:', error)
        return NextResponse.json(
        { error: 'Failed to update aduan' },
        { status: 500 }
        )
    }
    }

    // DELETE aduan
    export async function DELETE(
        request: Request, { params }: { params: Promise<{ id: string }> } // Corrected type definition
    ) {
    try {
        const id = (await params).id;
        await prisma.aduan.delete({
        where: { id: Number(id) }
        })

        return NextResponse.json(
        { message: 'Aduan deleted successfully' },
        { status: 200 }
        )
    } catch (error : unknown) {
        console.error('Error deleting aduan:', error)
        return NextResponse.json(
        { error: 'Failed to delete aduan' },
        { status: 500 }
        )
    }
}
