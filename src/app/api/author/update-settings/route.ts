import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveTripSettings, getTripSettings } from '@/lib/settings'

export async function POST(request: Request) {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'author') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await request.json()
    
    // Basic validation
    if ((!data.startDate && !data.endDate && !data.timelineFooter && 
         data.extraDaysBefore === undefined && data.extraDaysAfter === undefined)) {
      return NextResponse.json(
        { error: 'No valid settings to update' },
        { status: 400 }
      )
    }
    
    // Get current settings first
    const currentSettings = await getTripSettings()
    
    // Format the settings data (merge with current settings)
    const settingsData = {
      ...currentSettings,
      startDate: data.startDate || currentSettings.startDate,
      endDate: data.endDate || currentSettings.endDate,
      timelineFooter: data.timelineFooter !== undefined ? data.timelineFooter : currentSettings.timelineFooter,
      extraDaysBefore: data.extraDaysBefore !== undefined ? Number(data.extraDaysBefore) : currentSettings.extraDaysBefore,
      extraDaysAfter: data.extraDaysAfter !== undefined ? Number(data.extraDaysAfter) : currentSettings.extraDaysAfter
    }
    
    // Save the settings
    const success = await saveTripSettings(settingsData)
    
    if (!success) {
      throw new Error('Failed to save trip settings')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating trip settings:', error)
    return NextResponse.json(
      { error: 'Failed to update trip settings' },
      { status: 500 }
    )
  }
}
