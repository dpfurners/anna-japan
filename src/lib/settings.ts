import fs from 'fs'
import path from 'path'

interface TripSettings {
  startDate: string; // ISO format with time "YYYY-MM-DDTHH:MM:SS"
  endDate: string;   // ISO format with time "YYYY-MM-DDTHH:MM:SS"
  timelineFooter?: string; // Optional footer for the timeline
  extraDaysBefore: number; // Number of days before trip start that are allowed for entries
  extraDaysAfter: number;  // Number of days after trip end that are allowed for entries
}

interface SiteTextSettings {
  siteTitle: string;
  siteSubtitle: string;
  siteThought: string;
  counterTitle: {
    before: string;
    during: string;
    after: string;
  };
  counterMessage: {
    before: string;
    during: string;
    after: string;
  };
  timeline: {
    empty: string;
    emptySubtext: string;
    upcoming: string;
    upcomingSubtext: string;
  };
  login: {
    title: string;
    subtitle: string;
    footer: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    button: string;
    buttonLoading: string;
  };
  dashboard: {
    title: string;
    newButton: string;
    settingsButton: string;
    siteTextButton: string;
  };
}

const SETTINGS_DIR = path.join(process.cwd(), 'settings')
const TRIP_SETTINGS_FILE = path.join(SETTINGS_DIR, 'trip.json')
const SITE_TEXT_SETTINGS_FILE = path.join(SETTINGS_DIR, 'site-text.json')

// Default trip settings
const DEFAULT_TRIP_SETTINGS: TripSettings = {
  startDate: "2025-07-24T00:00:00",
  endDate: "2025-10-24T23:59:59",
  timelineFooter: "Made with love for my beautiful Anna 💕",
  extraDaysBefore: 14, // Default: Allow entries for 2 weeks before trip
  extraDaysAfter: 7    // Default: Allow entries for 1 week after trip
}

// Default site text settings
const DEFAULT_SITE_TEXT_SETTINGS: SiteTextSettings = {
  siteTitle: "For My Beautiful Anna 💕",
  siteSubtitle: "Daniel's Journey in Japan • July 24 - October 24, 2025",
  siteThought: "Every moment here, I'm thinking of you ✨",
  counterTitle: {
    before: "Daniel's Trip to Japan 🇯🇵",
    during: "Until Daniel Returns Home ✈️",
    after: "Daniel is Home! 🎉"
  },
  counterMessage: {
    before: "The journey hasn't begun yet! Stay tuned...",
    during: "Daniel misses you every single moment 💕",
    after: "🎉 Daniel is finally home with you! 🎉"
  },
  timeline: {
    empty: "No messages from Daniel yet...",
    emptySubtext: "Check back soon for updates! 💕",
    upcoming: "More adventures and messages coming soon... 🌸",
    upcomingSubtext: "Anna, you're always in my heart ✨"
  },
  login: {
    title: "For Anna 💕",
    subtitle: "Login to see Daniel's messages",
    footer: "Only Anna has access to these messages 💕",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    button: "Login",
    buttonLoading: "Logging in..."
  },
  dashboard: {
    title: "Daniel's Dashboard",
    newButton: "New Message",
    settingsButton: "Trip Settings",
    siteTextButton: "Site Text"
  }
}

/**
 * Get the current trip settings
 */
export async function getTripSettings(): Promise<TripSettings> {
  try {
    // Create settings directory if it doesn't exist
    if (!fs.existsSync(SETTINGS_DIR)) {
      fs.mkdirSync(SETTINGS_DIR, { recursive: true })
    }
    
    // Create default settings file if it doesn't exist
    if (!fs.existsSync(TRIP_SETTINGS_FILE)) {
      fs.writeFileSync(TRIP_SETTINGS_FILE, JSON.stringify(DEFAULT_TRIP_SETTINGS, null, 2))
      return DEFAULT_TRIP_SETTINGS
    }
    
    // Read and parse settings file
    const settingsData = fs.readFileSync(TRIP_SETTINGS_FILE, 'utf8')
    const settings = JSON.parse(settingsData) as TripSettings
    
    return {
      ...DEFAULT_TRIP_SETTINGS, // Provide defaults
      ...settings // Override with actual settings
    }
  } catch (error) {
    console.error('Error reading trip settings:', error)
    return DEFAULT_TRIP_SETTINGS
  }
}

/**
 * Save trip settings
 */
export async function saveTripSettings(settings: TripSettings): Promise<boolean> {
  try {
    // Create settings directory if it doesn't exist
    if (!fs.existsSync(SETTINGS_DIR)) {
      fs.mkdirSync(SETTINGS_DIR, { recursive: true })
    }
    
    // Merge with existing settings to ensure all fields are present
    const currentSettings = await getTripSettings()
    const updatedSettings = { 
      ...currentSettings,
      ...settings
    }
    
    // Write settings to file
    fs.writeFileSync(TRIP_SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
    return true
  } catch (error) {
    console.error('Error saving trip settings:', error)
    return false
  }
}

/**
 * Helper to extract the formatted start and end dates for public consumption
 */
export async function getPublicTripDates() {
  const settings = await getTripSettings()
  return {
    startDate: settings.startDate.split('T')[0], // Just the date part
    endDate: settings.endDate.split('T')[0],     // Just the date part
    startDateTime: settings.startDate,           // Full ISO datetime
    endDateTime: settings.endDate                // Full ISO datetime
  }
}

/**
 * Get the current site text settings
 */
export async function getSiteTextSettings(): Promise<SiteTextSettings> {
  try {
    // Create settings directory if it doesn't exist
    if (!fs.existsSync(SETTINGS_DIR)) {
      fs.mkdirSync(SETTINGS_DIR, { recursive: true })
    }
    
    // Create default settings file if it doesn't exist
    if (!fs.existsSync(SITE_TEXT_SETTINGS_FILE)) {
      fs.writeFileSync(SITE_TEXT_SETTINGS_FILE, JSON.stringify(DEFAULT_SITE_TEXT_SETTINGS, null, 2))
      return DEFAULT_SITE_TEXT_SETTINGS
    }
    
    // Read and parse settings file
    const settingsData = fs.readFileSync(SITE_TEXT_SETTINGS_FILE, 'utf8')
    const settings = JSON.parse(settingsData) as SiteTextSettings
    
    // Deep merge to ensure all fields are present, even nested ones
    return deepMerge(DEFAULT_SITE_TEXT_SETTINGS, settings)
  } catch (error) {
    console.error('Error reading site text settings:', error)
    return DEFAULT_SITE_TEXT_SETTINGS
  }
}

/**
 * Save site text settings
 */
export async function saveSiteTextSettings(settings: Partial<SiteTextSettings>): Promise<boolean> {
  try {
    // Create settings directory if it doesn't exist
    if (!fs.existsSync(SETTINGS_DIR)) {
      fs.mkdirSync(SETTINGS_DIR, { recursive: true })
    }
    
    // Merge with existing settings to ensure all fields are present
    const currentSettings = await getSiteTextSettings()
    const updatedSettings = deepMerge(currentSettings, settings)
    
    // Write settings to file
    fs.writeFileSync(SITE_TEXT_SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
    return true
  } catch (error) {
    console.error('Error saving site text settings:', error)
    return false
  }
}

/**
 * Helper function to deep merge objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof typeof source]
      
      if (isObject(sourceValue)) {
        if (!(key in target)) {
          output[key as keyof T] = sourceValue as T[keyof T]
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          output[key as keyof T] = deepMerge(target[key as keyof T] as any, sourceValue as any) as any
        }
      } else {
        output[key as keyof T] = sourceValue as T[keyof T]
      }
    })
  }
  
  return output
}

/**
 * Helper function to check if value is an object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(item: any): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}
