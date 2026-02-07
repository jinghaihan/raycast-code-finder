import type { Application, List } from '@raycast/api'
import type { EditorName } from 'code-finder'
import type { EntryItem, PinMethods, RemoveMethods } from '../types'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  Action,
  ActionPanel,
  Grid,
  Icon,
  open,
  openExtensionPreferences,
  showToast,
  Toast,
} from '@raycast/api'
import { usePromise } from '@raycast/utils'
import { EDITOR_NAME_MAP } from 'code-finder'
import { useCallback, useState } from 'react'
import { stringToColor } from '../color'
import { useDatabase } from '../database'
import { getBundleId, getEditorApplication } from '../editor'
import {
  Layout,
  LayoutDropdown,
  LayoutDropdownItem,
  LayoutDropdownSection,
  LayoutItem,
  LayoutSection,
} from '../layout'
import { usePinnedEntries } from '../pinned'
import { preferences } from '../preferences'
import { PinActionSection } from '../sections/pinned'
import { RemoveActionSection } from '../sections/remove'
import { EntryType } from '../types'
import { filterEntriesByType, filterUnpinnedEntries } from '../utils'

interface EntriesListProps {
  editor: EditorName
}

export function EntriesList({ editor }: EntriesListProps) {
  const { loading, entries, ...removeMethods } = useDatabase()
  const [type, setType] = useState<EntryType | null>(null)
  const { pinnedEntries, ...pinnedMethods } = usePinnedEntries()

  const fetchEditorApp = useCallback(async () => {
    return getEditorApplication(editor)
  }, [editor])

  const { data: editorApp } = usePromise(fetchEditorApp)

  return (
    <Layout
      columns={6}
      inset={Grid.Inset.Medium}
      searchBarPlaceholder="Search recent projects..."
      isLoading={loading}
      filtering={{ keepSectionOrder: preferences.keepSectionOrder }}
      searchBarAccessory={<EntryTypeDropdown onChange={setType} />}
    >
      <LayoutSection title="Pinned Projects">
        {pinnedEntries.filter(filterEntriesByType(type)).map((entry: EntryItem) => (
          <ListItem key={entry.uri} entry={entry} editor={editor} pinned={true} editorApp={editorApp} {...pinnedMethods} {...removeMethods} />
        ))}
      </LayoutSection>
      <LayoutSection title="Recent Projects">
        {entries
          .filter(filterUnpinnedEntries(pinnedEntries))
          .filter(filterEntriesByType(type))
          .map((entry: EntryItem) => (
            <ListItem key={entry.uri} entry={entry} editor={editor} editorApp={editorApp} {...pinnedMethods} {...removeMethods} />
          ))}
      </LayoutSection>
    </Layout>
  )
}

function ListItem(props: { entry: EntryItem, editor: EditorName, editorApp?: Application, pinned?: boolean } & PinMethods & RemoveMethods) {
  const title = `Open in ${EDITOR_NAME_MAP[props.editor] ?? props.editor}`
  const name = props.entry.name
  const filePath = fileURLToPath(props.entry.uri)
  const path = props.entry.path
  const gitBranch = props.entry.branch
  const branchColor = gitBranch ? stringToColor(gitBranch) : ''
  const keywords = path.split('/')
  const bundleIdentifier = getBundleId(props.editor)

  const accessories: List.Item.Props['accessories'] = []
  if (gitBranch) {
    accessories.push({
      tag: {
        value: gitBranch,
        color: branchColor,
      },
      tooltip: `Git Branch: ${gitBranch}`,
    })
  }

  const subTitle = preferences.layout === 'grid' ? `${gitBranch} • ${path}` : path

  const openProject = () => {
    const target = filePath || path
    execFile('open', ['-b', bundleIdentifier, target], (err) => {
      if (err)
        showToast(Toast.Style.Failure, `Failed to open with ${EDITOR_NAME_MAP[props.editor] ?? props.editor}`)
    })
    // open is not working, but `open -b` can not auto close the window
    open(target, bundleIdentifier)
  }

  return (
    <LayoutItem
      id={path}
      title={name}
      subtitle={subTitle}
      icon={{ fileIcon: path }}
      content={{ fileIcon: path }}
      keywords={keywords}
      accessories={accessories}
      actions={(
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              title={title}
              icon={props.editorApp ? { fileIcon: props.editorApp.path } : 'action-icon.png'}
              onAction={openProject}
            />
            <Action.ShowInFinder path={filePath} />
            <Action.OpenWith path={filePath} shortcut={{ modifiers: ['cmd'], key: 'o' }} />
            {props.entry.type === EntryType.Folders && preferences.terminalApp && (
              <Action
                title={`Open with ${preferences.terminalApp.name}`}
                icon={{ fileIcon: preferences.terminalApp.path }}
                shortcut={{ modifiers: ['cmd', 'shift'], key: 'o' }}
                onAction={() =>
                  open(path, preferences.terminalApp).catch(() =>
                    showToast(Toast.Style.Failure, `Failed to open with ${preferences.terminalApp?.name}`),
                  )}
              />
            )}
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action.CopyToClipboard title="Copy Name" content={name} shortcut={{ modifiers: ['cmd'], key: '.' }} />
            <Action.CopyToClipboard
              title="Copy Path"
              content={path}
              shortcut={{ modifiers: ['cmd', 'shift'], key: '.' }}
            />
          </ActionPanel.Section>
          <PinActionSection {...props} />
          <RemoveActionSection {...props} />
          <Action
            title="Open Preferences"
            icon={Icon.Gear}
            onAction={openExtensionPreferences}
          />
        </ActionPanel>
      )}
    >
    </LayoutItem>
  )
}

function EntryTypeDropdown(props: { onChange: (type: EntryType) => void }) {
  return (
    <LayoutDropdown
      tooltip="Filter project types"
      defaultValue={EntryType.AllTypes}
      storeValue
      onChange={value => props.onChange(value as EntryType)}
    >
      <LayoutDropdownItem title="All Types" value="All Types" />
      <LayoutDropdownSection>
        {Object.values(EntryType)
          .filter(key => key !== 'All Types')
          .sort()
          .map(key => (
            <LayoutDropdownItem key={key} title={key} value={key} />
          ))}
      </LayoutDropdownSection>
    </LayoutDropdown>
  )
}
