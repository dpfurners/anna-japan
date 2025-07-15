import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample trip days from July 13 to October 24, 2025
  // Daniel's solo journey to Japan while thinking of Anna
  // Starting two days in the past for testing
  const startDate = new Date('2025-07-13')
  const endDate = new Date('2025-10-24')
  
  const sampleDays = [
    {
      date: new Date('2025-07-13'),
      title: "The Journey Begins",
      content: "Tomorrow I leave for Japan, Anna. My heart is already aching knowing I'll be so far from you. But I promise to document every moment, every thought of you, every place that reminds me of us. This adventure is for both of us, my love. 💕",
      songTitle: "Can't Help Myself",
      songArtist: "Four Tops",
      songLyrics: "I can't help myself\nI love you and nobody else\nIn and out my life\nYou come and you go",
      spotifyUrl: "https://open.spotify.com/embed/track/6Cy0NVYKUuxEPaF0qhowt8"
    },
    {
      date: new Date('2025-07-14'),
      title: "Last Night Before Departure",
      content: "It's my last night here and all I can think about is how much I'm going to miss your laugh, your smile, the way you make everything better. I'm taking a piece of you with me to Japan, Anna. Every sunrise there will be dedicated to you. ✨",
      songTitle: "Make You Feel My Love",
      songArtist: "Adele",
      songLyrics: "When the rain is blowing in your face\nAnd the whole world is on your case\nI could offer you a warm embrace\nTo make you feel my love",
      spotifyUrl: "https://open.spotify.com/embed/track/4i6cGF8mOcGt7XiUHNBQdQ"
    },
    {
      date: new Date('2025-07-15'),
      title: "At the Airport, Thinking of You",
      content: "Sitting at the airport right now, Anna. Every couple I see makes me think of us. I wish you were here holding my hand, getting excited about the adventure ahead. Instead, I'm here writing to you, counting down the moments until I can hold you again. 🌸",
      songTitle: "All of Me",
      songArtist: "John Legend",
      songLyrics: "All of me loves all of you\nLove your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I'll give my all to you",
      spotifyUrl: "https://open.spotify.com/embed/track/3U4isOIWM3VvDubwSI3y7a"
    },
    {
      date: new Date('2025-07-24'),
      title: "Missing You Already",
      content: "Just landed in Japan, my love. The first thing I did was wish you were here with me. Every beautiful sight reminds me of you. This journey is for both of us, even though you're not physically here. 💕",
      songTitle: "Perfect",
      songArtist: "Ed Sheeran",
      songLyrics: "I found a love for me\nOh darling, just dive right in and follow my lead\nWell, I found a girl, beautiful and sweet\nOh, I never knew you were the someone waiting for me",
      spotifyUrl: "https://open.spotify.com/embed/track/0tgVpDi06FyKpA1z0VMD4v"
    },
    {
      date: new Date('2025-07-25'),
      title: "Tokyo Dreams of You",
      content: "Walking through the streets of Tokyo, I keep imagining you beside me. Every cherry blossom I see, every beautiful moment - I'm collecting them all in my heart to share with you when I return. You're in every sunset here, Anna. ✨",
      songTitle: "All of Me",
      songArtist: "John Legend",
      songLyrics: "All of me loves all of you\nLove your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I'll give my all to you",
      spotifyUrl: "https://open.spotify.com/embed/track/3U4isOIWM3VvDubwSI3y7a"
    },
    {
      date: new Date('2025-07-26'),
      title: "Wishing You Were Here",
      content: "Visited the most romantic temple today. Made a wish for us, for our future, for all the adventures we'll share together. This solo journey is making me realize even more how much I love and miss you every single day. 🌸",
      songTitle: "Thinking Out Loud",
      songArtist: "Ed Sheeran",
      songLyrics: "When your legs don't work like they used to before\nAnd I can't sweep you off of your feet\nWill your mouth still remember the taste of my love\nWill your eyes still smile from your cheeks",
      spotifyUrl: "https://open.spotify.com/embed/track/6PGoSes0D9eUDeeAafB2As"
    }
  ]

  for (const day of sampleDays) {
    await prisma.tripDay.upsert({
      where: { date: day.date },
      update: {},
      create: day
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
