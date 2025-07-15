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
    const existingDay = await getDayBySlug(slug)
    
    if (!existingDay) {
      return NextResponse.json(
        { error: 'Day not found' },
        { status: 404 }
      )
    }
    
    const data = await request.json()
    
    // Basic validation
    if (!data.title || !data.content || !data.songTitle || !data.songArtist) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Update the day data
    const updatedDay = {
      ...existingDay,
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
    
    // Save the updated day content
    const success = await saveDayContent(updatedDay)
    
    if (!success) {
      throw new Error('Failed to save day content')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error updating day ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to update day' },
      { status: 500 }
    )
  }
}
