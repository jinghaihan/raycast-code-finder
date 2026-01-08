/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** View Layout - Select the layout of the view */
  "layout": "list" | "grid",
  /** Advanced - Keep the order of the sections while searching folders, files, etc. */
  "keepSectionOrder": boolean,
  /** Terminal App - Select which Terminal App to use when opening with a terminal */
  "terminalApp"?: import("@raycast/api").Application,
  /** Git Integration - Display the current Git branch for files and folders in Git repositories */
  "showGitBranch": boolean,
  /** Cache TTL - The time to live for the cache in milliseconds */
  "cacheTTL": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `vscode` command */
  export type Vscode = ExtensionPreferences & {}
  /** Preferences accessible in the `cursor` command */
  export type Cursor = ExtensionPreferences & {}
  /** Preferences accessible in the `windsurf` command */
  export type Windsurf = ExtensionPreferences & {}
  /** Preferences accessible in the `antigravity` command */
  export type Antigravity = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `vscode` command */
  export type Vscode = {}
  /** Arguments passed to the `cursor` command */
  export type Cursor = {}
  /** Arguments passed to the `windsurf` command */
  export type Windsurf = {}
  /** Arguments passed to the `antigravity` command */
  export type Antigravity = {}
}

