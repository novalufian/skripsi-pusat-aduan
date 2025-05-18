// app/api/debug/route.ts
export async function GET() {
  return Response.json({
    dbUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  })
}
