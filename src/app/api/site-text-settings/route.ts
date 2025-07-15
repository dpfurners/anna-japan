import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSiteTextSettings } from '@/lib/settings'

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
    
    // Get site text settings
    const settings = await getSiteTextSettings()
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site text settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site text settings' },
      { status: 500 }
    )
  }
}
