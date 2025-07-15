import { NextResponse } from 'next/server'
import { getDayBySlug } from '@/lib/days'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'author') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const slug = await Promise.resolve(params.slug)
    const day = await getDayBySlug(slug)
    
    if (!day) {
      return NextResponse.json(
        { error: 'Day not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(day)
  } catch (error) {
    console.error(`Error fetching day ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch day' },
      { status: 500 }
    )
  }
}
