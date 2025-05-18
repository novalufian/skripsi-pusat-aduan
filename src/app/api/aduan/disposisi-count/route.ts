// app/api/aduan/disposisi-count/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function GET() {
    try {
        // Group by disposisi and count
        const disposisiCounts = await prisma.aduan.groupBy({
        by: ['disposisi'],
        _count: {
            disposisi: true,
        },
        orderBy: {
            _count: {
            disposisi: 'desc',
            },
        },
        })

        // Transform the data for easier use
        const result = disposisiCounts.map(item => ({
        disposisi: item.disposisi,
        count: item._count.disposisi,
        }))

        return NextResponse.json(result)
    } catch (error : unknown) {
        console.error('Error fetching disposisi counts:', error)
        return NextResponse.json(
        { error: 'Failed to fetch disposisi counts' },
        { status: 500 }
        )
    }
}
