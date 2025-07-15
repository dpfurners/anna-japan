import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTripSettings } from '@/lib/settings'

export async function GET() {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get trip settings
    const settings = await getTripSettings()
    
    return NextResponse.json({
      startDateTime: settings.startDate,
      endDateTime: settings.endDate,
      timelineFooter: settings.timelineFooter,
      extraDaysBefore: settings.extraDaysBefore,
      extraDaysAfter: settings.extraDaysAfter
    })
  } catch (error) {
    console.error('Error fetching trip settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip settings' },
      { status: 500 }
    )
  }
}
