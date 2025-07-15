import { NextResponse } from 'next/server'
import { getAllVisibleDays } from '@/lib/days'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    
    const tripDays = await getAllVisibleDays()
    
    // Map the file-based data to match the expected TripDay interface for the frontend
    const formattedDays = tripDays.map((day, index) => ({
      id: index + 1,
      date: day.date,
      title: day.title,
      content: day.content,
      songTitle: day.songTitle,
      songArtist: day.songArtist,
      songLyrics: day.songLyrics,
      spotifyUrl: day.spotifyUrl
    }))

    return NextResponse.json(formattedDays)
  } catch (error) {
    console.error('Error fetching trip days:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip days' },
      { status: 500 }
    )
  }
}
