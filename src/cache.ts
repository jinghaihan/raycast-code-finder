import type { EntryItem } from './types'
import { LocalStorage } from '@raycast/api'
import { preferences } from './preferences'

const CACHE_KEY = 'code-finder-cache'
const CACHE_TIMESTAMP = 'code-finder-cache-timestamp'

export async function getCachedData(): Promise<EntryItem[] | undefined> {
  try {
    const cacheTTL = Number.isNaN(Number(preferences.cacheTTL)) ? 30000 : Number(preferences.cacheTTL)
    if (cacheTTL <= 0)
      return

    const timestamp = await LocalStorage.getItem<number>(CACHE_TIMESTAMP)
    if (!timestamp)
      return

    const cache = await LocalStorage.getItem<string>(CACHE_KEY)
    if (cache && Date.now() - timestamp < cacheTTL)
      return JSON.parse(cache)
  }
  catch {

  }
}

export async function setCachedData(data: EntryItem[]) {
  LocalStorage.setItem(CACHE_KEY, JSON.stringify(data))
  LocalStorage.setItem(CACHE_TIMESTAMP, Date.now().toString())
}
