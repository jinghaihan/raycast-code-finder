import type { Application } from '@raycast/api'
import type { CodeName } from 'code-finder'
import { getApplications } from '@raycast/api'
import { LRUCache } from 'lru-cache'

const cacheApplications = new LRUCache<string, Application>({
  max: 1000,
})

async function cachedGetApplications() {
  if (cacheApplications.size === 0) {
    const apps = await getApplications()
    apps.forEach((app) => {
      if (app.bundleId)
        cacheApplications.set(app.bundleId, app)
    })
  }
}

/// keep-sorted
// Map of build names to bundle IDs
const bundleIdMap: Record<string, string> = {
  'Antigravity': 'com.google.antigravity',
  'Code - Insiders': 'com.microsoft.VSCodeInsiders',
  'Code': 'com.microsoft.VSCode',
  'Cursor': 'com.todesktop.230313mzl4w4u92',
  'Kiro': 'dev.kiro.desktop',
  'Positron': 'com.rstudio.positron',
  'Trae CN': 'cn.trae.app',
  'Trae': 'com.trae.app',
  'VSCodium - Insiders': 'com.vscodium.VSCodiumInsiders',
  'VSCodium': 'com.vscodium',
  'Windsurf': 'com.exafunction.windsurf',
}

/**
 * Get the bundle ID for the specified editor
 * @param editor The name of the editor (e.g., "vscode", "vscodium", etc.)
 * @returns The bundle ID for the specified editor
 */
export function getBundleId(editor: CodeName): string {
  return bundleIdMap[editor] || ''
}

/**
 * Get the application for the specified editor
 * @param editor The name of the editor (e.g., "vscode", "vscodium", etc.)
 * @returns Promise resolving to the Application object or undefined if not found
 */
export async function getEditorApplication(editor: CodeName): Promise<Application | undefined> {
  await cachedGetApplications()

  // Find the app by bundle ID
  const bundleId = getBundleId(editor)
  if (bundleId) {
    const app = cacheApplications.get(bundleId)
    if (app)
      return app
  }

  return undefined
}
