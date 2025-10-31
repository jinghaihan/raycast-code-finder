import type { HistoryEntry } from 'code-finder'
import type { EntryType } from './types'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual, promisify } from 'node:util'

export const execFileAsync = promisify(execFile)

export function normalizePath(path: string) {
  if (path.startsWith('file://')) {
    try {
      return fileURLToPath(path)
    }
    catch {
      return path
    }
  }
  return path
}

export function filterEntriesByType(filter: EntryType | null) {
  switch (filter) {
    case 'All Types':
      return (_: HistoryEntry) => true
    case 'Folders':
      return (entry: HistoryEntry) => !!entry.folderUri
    case 'Files':
      return (entry: HistoryEntry) => !!entry.fileUri
    default:
      return (_: HistoryEntry) => false
  }
}

export function filterUnpinnedEntries(pinnedEntries: HistoryEntry[]) {
  return (entry: HistoryEntry) => pinnedEntries.find(pinnedEntry => isDeepStrictEqual(pinnedEntry, entry)) === undefined
}
