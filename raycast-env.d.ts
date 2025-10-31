/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Workspace - The workspace to detect codespaces */
  "workspace": string,
  /** View Layout - Select the layout of the view */
  "layout": "list" | "grid",
  /** Terminal App - Select which Terminal App to use when opening with a terminal */
  "terminalApp"?: import("@raycast/api").Application,
  /** Git Integration - Display the current Git branch for files and folders in Git repositories */
  "showGitBranch": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
}

