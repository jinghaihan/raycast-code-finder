import type { HistoryEntry } from 'code-finder'
import { executeCommand } from 'code-finder'
import { useEffect, useState } from 'react'
import { preferences } from './preferences'

export function useCodeFinder() {
  const [loading, setLoading] = useState(false)
  const [codespaces, setCodespaces] = useState<HistoryEntry[]>([])

  useEffect(() => {
    async function getCodespaces() {
      setLoading(true)

      const result = await executeCommand({
        cwd: preferences.workspace,
        ignorePaths: preferences.ignorePaths,
        gitBranch: preferences.showGitBranch,
        tildify: true,
      })

      setCodespaces(result.data)
      setLoading(false)
    }
    getCodespaces()
  }, [])

  return { loading, codespaces }
}
