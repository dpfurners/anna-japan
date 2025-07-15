import fs from 'fs'
import path from 'path'

interface TripSettings {
  startDate: string; // ISO format with time "YYYY-MM-DDTHH:MM:SS"
  endDate: string;   // ISO format with time "YYYY-MM-DDTHH:MM:SS"
  timelineFooter?: string; // Optional footer for the timeline
  extraDaysBefore: number; // Number of days before trip start that are allowed for entries
  extraDaysAfter: number;  // Number of days after trip end that are allowed for entries
}

const SETTINGS_DIR = path.join(process.cwd(), 'settings')
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'trip.json')

// Default settings
const DEFAULT_SETTINGS: TripSettings = {
  startDate: "2025-07-24T00:00:00",
  endDate: "2025-10-24T23:59:59",
  timelineFooter: "Made with love for my beautiful Anna 💕",
  extraDaysBefore: 14, // Default: Allow entries for 2 weeks before trip
  extraDaysAfter: 7    // Default: Allow entries for 1 week after trip
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
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2))
      return DEFAULT_SETTINGS
    }
    
    // Read and parse settings file
    const settingsData = fs.readFileSync(SETTINGS_FILE, 'utf8')
    const settings = JSON.parse(settingsData) as TripSettings
    
    return {
      ...DEFAULT_SETTINGS, // Provide defaults
      ...settings // Override with actual settings
    }
  } catch (error) {
    console.error('Error reading trip settings:', error)
    return DEFAULT_SETTINGS
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
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
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
