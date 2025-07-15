import { NextResponse } from 'next/server'
import { getAllDays } from '@/lib/days'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'author') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For the author, get ALL days, including unpublished ones
    const allDays = await getAllDays()
    
    // Map the data to just what we need for the dashboard
    const dashboardData = allDays.map(day => ({
      slug: day.slug,
      date: day.date,
      title: day.title,
      published: day.published
    }))

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching days for author:', error)
    return NextResponse.json(
      { error: 'Failed to fetch days' },
      { status: 500 }
    )
  }
}
