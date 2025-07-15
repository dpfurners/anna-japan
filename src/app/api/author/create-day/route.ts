import { NextResponse } from 'next/server'
import { saveDayContent } from '@/lib/days'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    if (!data.date || !data.title || !data.content || !data.songTitle || !data.songArtist) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Format the day data
    const dayData = {
      date: data.date,
      slug: data.date,
      title: data.title,
      content: data.content,
      songTitle: data.songTitle,
      songArtist: data.songArtist,
      spotifyTrackId: data.spotifyTrackId || '',
      songLyrics: data.songLyrics || '',
      published: data.published,
      spotifyUrl: data.spotifyTrackId ? 
        `https://open.spotify.com/embed/track/${data.spotifyTrackId}?utm_source=generator&theme=0` : 
        undefined
    }
    
    // Save the day content
    const success = await saveDayContent(dayData)
    
    if (!success) {
      throw new Error('Failed to save day content')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating new day:', error)
    return NextResponse.json(
      { error: 'Failed to create new day' },
      { status: 500 }
    )
  }
}
