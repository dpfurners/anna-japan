import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DAYS_JSON_PATH = path.join(process.cwd(), 'days', 'days.json');
const CONTENT_DIR = path.join(process.cwd(), 'days', 'content');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Read days.json
const daysJson = JSON.parse(fs.readFileSync(DAYS_JSON_PATH, 'utf8'));

// Convert each entry to a markdown file
daysJson.forEach(day => {
  // Create slug from date
  const slug = day.date;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  // Default content if not provided
  const content = day.content || `Hello my beautiful Anna,

I miss you so much today. Every moment I spend in Japan makes me think of you and how much better this experience would be if you were here with me.

I'm counting the days until I can hold you in my arms again.

Love always,
Daniel 💕`;

  // Create frontmatter
  const frontmatter = {
    date: day.date,
    title: day.title,
    songTitle: day.songTitle,
    songArtist: day.songArtist,
    spotifyTrackId: day.spotifyTrackId,
    published: day.published !== false, // default to true if not specified
    lyrics: day.songLyrics || "♫ Insert song lyrics here ♫" // Default lyrics if not provided
  };
  
  // Convert to markdown with frontmatter
  const fileContent = matter.stringify(content, frontmatter);
  
  // Write to file
  fs.writeFileSync(filePath, fileContent);
  console.log(`Created ${slug}.md`);
});

console.log('Conversion complete! All entries from days.json have been converted to markdown files.');
