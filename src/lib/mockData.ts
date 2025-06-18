import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync' // Add this package: npm install csv-parse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, 'Expanded_Diary_Entries.csv')

//console.log('=== PROPER CSV PARSING ===')

// 1. Read file with proper encoding
const content = fs.readFileSync(csvPath, 'utf8').replace(/\uFFFD/g, "'") // Fix special chars

// 2. Parse with proper CSV parser
const records = parse(content, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true
})

// 3. Verify parsing
//console.log(`Found ${records.length} valid records`)
// console.log('Sample records:', records.slice(0, 3).map(r => ({
//   transcript: r.transcript_raw?.substring(0, 50),
//   tags: r.tags_user
// })))

// 4. Build entries with proper data
function buildEntry(record: any, id: number): VoiceEntry {
  return {
    id: String(id),
    user_id: 'mock',
    audio_url: null,
    transcript_raw: record.transcript_raw || '',
    transcript_user: record.transcript_user || '',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: record.tags_model?.split('|') || [],
    tags_user: record.tags_user?.split('|') || ['reflection'],
    category: null,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString(),
    emotion_score_score: parseFloat(record.emotion_score_score) || null,
    embedding: null
  }
}

export const mockVoiceEntries: VoiceEntry[] = records.map(buildEntry)