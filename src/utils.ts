import type { EntryItem, EntryType } from './types'
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
      return (_: EntryItem) => true
    case 'Folders':
      return (entry: EntryItem) => !!entry.folderUri
    case 'Files':
      return (entry: EntryItem) => !!entry.fileUri
    default:
      return (_: EntryItem) => false
  }
}

export function filterUnpinnedEntries(pinnedEntries: EntryItem[]) {
  return (entry: EntryItem) => pinnedEntries.find(pinnedEntry => isDeepStrictEqual(pinnedEntry, entry)) === undefined
}
