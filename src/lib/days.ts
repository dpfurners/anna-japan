import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DayContent {
  date: string
  title: string
  content: string
  songTitle: string
  songArtist: string
  songLyrics: string
  spotifyUrl?: string
  spotifyTrackId: string
  published: boolean
  slug: string
}

const DAYS_DIR = path.join(process.cwd(), 'days')
const CONTENT_DIR = path.join(DAYS_DIR, 'content')

export async function getAllDays(): Promise<DayContent[]> {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return []
    }
    
    // Get all markdown files from the content directory
    const fileNames = fs.readdirSync(CONTENT_DIR)
    
    const allDays = fileNames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        // Get the file path
        const filePath = path.join(CONTENT_DIR, filename)
        
        // Remove extension to get date (slug)
        const slug = filename.replace(/\.md$/, '')
        
        // Read markdown file as string
        const fileContent = fs.readFileSync(filePath, 'utf8')
        
        // Parse markdown frontmatter
        const { data: frontmatter, content } = matter(fileContent)
        
        // Return the combined data
        return {
          date: slug,
          slug,
          title: frontmatter.title,
          songTitle: frontmatter.songTitle,
          songArtist: frontmatter.songArtist,
          spotifyTrackId: frontmatter.spotifyTrackId,
          published: frontmatter.published !== false, // default to true if not specified
          songLyrics: frontmatter.lyrics || '',
          content: content.trim(),
          spotifyUrl: frontmatter.spotifyTrackId ? 
            `https://open.spotify.com/embed/track/${frontmatter.spotifyTrackId}?utm_source=generator&theme=0` : 
            undefined
        }
      })
      
    // Sort by date (newest first)
    return allDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error reading days:', error)
    return []
  }
}

export async function getDayBySlug(slug: string): Promise<DayContent | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter, content } = matter(fileContent)
    
    if (!frontmatter.title) {
      return null
    }

    return {
      date: slug,
      slug,
      title: frontmatter.title,
      content: content.trim(),
      songTitle: frontmatter.songTitle,
      songArtist: frontmatter.songArtist,
      spotifyTrackId: frontmatter.spotifyTrackId,
      published: frontmatter.published !== false, // default to true if not specified
      spotifyUrl: frontmatter.spotifyTrackId ? 
        `https://open.spotify.com/embed/track/${frontmatter.spotifyTrackId}?utm_source=generator&theme=0` : 
        undefined,
      songLyrics: frontmatter.lyrics || ''
    }
  } catch (error) {
    console.error(`Error reading day content for ${slug}:`, error)
    return null
  }
}

export async function getAllVisibleDays(): Promise<DayContent[]> {
  try {
    const allDays = await getAllDays()
    const currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999) // End of current day
    
    // Filter days that are published and not in the future
    return allDays.filter(day => {
      const dayDate = new Date(day.date)
      return day.published && dayDate <= currentDate
    })
  } catch (error) {
    console.error('Error getting visible days:', error)
    return []
  }
}

export async function saveDayContent(day: DayContent): Promise<boolean> {
  try {
    const filePath = path.join(CONTENT_DIR, `${day.slug}.md`)
    
    // Create the content directory if it doesn't exist
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true })
    }
    
    // Create frontmatter
    const frontmatter = {
      title: day.title,
      songTitle: day.songTitle,
      songArtist: day.songArtist,
      spotifyTrackId: day.spotifyTrackId,
      published: day.published,
      lyrics: day.songLyrics
    }
    
    // Convert to markdown with frontmatter
    const fileContent = matter.stringify(day.content, frontmatter)
    
    // Write to file
    fs.writeFileSync(filePath, fileContent)
    return true
  } catch (error) {
    console.error(`Error saving day content for ${day.slug}:`, error)
    return false
  }
}
