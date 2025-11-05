import type { EntryItem } from './types'
import { basename } from 'node:path'
import { Alert, confirmAlert, Icon, showToast, Toast } from '@raycast/api'
import { CODE_NAME_CHOICES, executeCommand, vscode } from 'code-finder'
import { useEffect, useState } from 'react'
import { getCachedData, setCachedData } from './cache'
import { preferences } from './preferences'
import { EntryType } from './types'

export function useDatabase() {
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<EntryItem[]>([])

  useEffect(() => {
    async function getEntries() {
      setLoading(true)

      const cached = await getCachedData()
      if (cached) {
        setEntries(cached)
        setLoading(false)
        return
      }

      const result = await executeCommand({
        mode: 'combine',
        gitBranch: preferences.showGitBranch,
        tildify: true,
      })

      const entries = result.data.map((item) => {
        return {
          ...item,
          path: item.path!,
          name: decodeURIComponent(basename(item.path!)),
          uri: (item.folderUri || item.fileUri)!,
          type: item.folderUri ? EntryType.Folders : EntryType.Files,
        }
      })
      setEntries(entries)
      await setCachedData(entries)
      setLoading(false)
    }
    getEntries()
  }, [])

  async function updateEntries(entries: EntryItem[]) {
    for (const code of CODE_NAME_CHOICES)
      await vscode.update(code, entries)
    setEntries(entries)
  }

  async function removeEntry(entry: EntryItem) {
    if (!entries.length) {
      await showToast(Toast.Style.Failure, 'No recent entries found')
      return
    }

    try {
      setLoading(true)
      const data = entries.filter(i => i.uri !== entry.uri)
      await updateEntries(data)
      setLoading(false)

      showToast(Toast.Style.Success, 'Entry removed', 'Restart editors to sync the history (optional)')
    }
    catch {
      showToast(Toast.Style.Failure, 'Failed to remove entry')
    }
  }

  async function removeAllEntries() {
    try {
      if (
        await confirmAlert({
          icon: Icon.Trash,
          title: 'Remove all recent entries?',
          message: 'This cannot be undone.',
          dismissAction: {
            title: 'Cancel',
            style: Alert.ActionStyle.Cancel,
          },
          primaryAction: {
            title: 'Remove',
            style: Alert.ActionStyle.Destructive,
          },
        })
      ) {
        setLoading(true)
        await updateEntries([])
        setLoading(false)

        showToast(
          Toast.Style.Success,
          'All entries removed',
          `Restart editors to sync the history (optional)`,
        )
      }
    }
    catch {
      showToast(Toast.Style.Failure, 'Failed to remove entries')
    }
  }

  return { loading, entries, removeEntry, removeAllEntries }
}
