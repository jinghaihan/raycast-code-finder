# Raycast Code Finder

A Raycast extension that aggregates recent project history from VSCode and its forks (Cursor, Windsurf) into a unified list. Quickly search through all your projects across different editors and open them with your preferred code editor.

```sh
npx rayext install jinghaihan/raycast-code-finder
```

<div align="center">
  <img src="./assets/commands.png" alt="commands" width="45%">
  <img src="./assets/list.png" alt="list" width="45%">
</div>

## Commands

<!-- commands -->

| Title                | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `Open with VSCode`   | List recent projects from VSCode and its forks, open with VSCode.   |
| `Open with Cursor`   | List recent projects from VSCode and its forks, open with Cursor.   |
| `Open with Windsurf` | List recent projects from VSCode and its forks, open with Windsurf. |

<!-- commands -->

## Configuration

<!-- configs -->

| Key                | Description                                                              | Required | Default            |
| ------------------ | ------------------------------------------------------------------------ | -------- | ------------------ |
| `layout`           | Select the layout of the view                                            | `No`     | list               |
| `keepSectionOrder` | Keep the order of the sections while searching folders, files, etc.      | `No`     | false              |
| `terminalApp`      | Select which Terminal App to use when opening with a terminal            | `No`     | com.apple.Terminal |
| `showGitBranch`    | Display the current Git branch for files and folders in Git repositories | `No`     | true               |
| `cacheTTL`         | The time to live for the cache in seconds                                | `No`     | 30000              |

<!-- configs -->

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)
