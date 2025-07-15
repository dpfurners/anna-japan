import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveSiteTextSettings } from '@/lib/settings'

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
    
    // Get request data
    const data = await request.json()
    
    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No valid settings to update' },
        { status: 400 }
      )
    }
    
    // Save the settings
    const success = await saveSiteTextSettings(data)
    
    if (!success) {
      throw new Error('Failed to save site text settings')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating site text settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site text settings' },
      { status: 500 }
    )
  }
}
