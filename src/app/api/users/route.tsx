import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany({
        include: {
            login: {
            select: {
                username: true // Exclude password from response
            }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
        })
        return NextResponse.json(users)
    } catch (error: unknown) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
        )
    }
    }

    export async function POST(request: Request) {
    try {
        const { nama, alamat, tempatLahir, tanggalLahir } = await request.json()

        // Validate required fields
        if (!nama ) {
        return NextResponse.json(
            { error: 'Nama, username, and password are required' },
            { status: 400 }
        )
        }

        // Check if username exists
        

        // Create user with login (password stored in plaintext - NOT recommended for production)
        const newUser = await prisma.user.create({
        data: {
            nama,
            alamat,
            tempatLahir,
            tanggalLahir: new Date(tanggalLahir),
        },
        include: {
            login: {
            select: {
                username: true
            }
            }
        }
        })

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
        )
    }
}
