// app/api/aduan/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    try {
        const aduan = await prisma.aduan.findMany({
            orderBy: {
            createdAt: 'desc'
            }
        })
        return NextResponse.json(aduan)
        } catch (error : unknown) {
        console.error('Error fetching aduan:', error)
        return NextResponse.json(
            { error: 'Failed to fetch aduan' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const { judul, deskripsi, disposisi } = await request.json()

        // Basic validation
        if (!judul || !deskripsi) {
        return NextResponse.json(
            { error: 'Judul and deskripsi are required' },
            { status: 400 }
        )
        }

        // Create with only the fields you need
        const newAduan = await prisma.aduan.create({
        data: {
            judul,
            deskripsi,
            disposisi
            // No status field included
        }
        })

        return NextResponse.json(newAduan, { status: 201 })
    } catch (error) {
        console.error('Error creating aduan:', error)
        return NextResponse.json(
        { error: 'Failed to create aduan' },
        { status: 500 }
        )
    }
}
