import { NextResponse } from 'next/server'
import { getDayBySlug, saveDayContent } from '@/lib/days'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
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
    
    const slug = params.slug
    const day = await getDayBySlug(slug)
    
    if (!day) {
      return NextResponse.json(
        { error: 'Day not found' },
        { status: 404 }
      )
    }
    
    // Toggle the published status
    day.published = !day.published
    
    // Save the updated content
    const success = await saveDayContent(day)
    
    if (!success) {
      throw new Error('Failed to save changes')
    }
    
    return NextResponse.json({ success: true, published: day.published })
  } catch (error) {
    console.error(`Error toggling publish status for ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to toggle publish status' },
      { status: 500 }
    )
  }
}
