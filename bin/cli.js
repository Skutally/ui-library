#!/usr/bin/env node

import { readFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs"
import { resolve, join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PKG_ROOT = resolve(__dirname, "..")

// ─── Colors (no dependencies) ────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold:  "\x1b[1m",
  dim:   "\x1b[2m",
  green: "\x1b[32m",
  cyan:  "\x1b[36m",
  yellow:"\x1b[33m",
  red:   "\x1b[31m",
  gray:  "\x1b[90m",
}

function success(msg) { console.log(`${c.green}✔${c.reset} ${msg}`) }
function info(msg)    { console.log(`${c.cyan}ℹ${c.reset} ${msg}`) }
function warn(msg)    { console.log(`${c.yellow}⚠${c.reset} ${msg}`) }
function error(msg)   { console.error(`${c.red}✘${c.reset} ${msg}`); process.exit(1) }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadRegistry() {
  const registryPath = join(PKG_ROOT, "registry", "registry.json")
  return JSON.parse(readFileSync(registryPath, "utf-8"))
}

function loadConfig() {
  const configPath = resolve(process.cwd(), "components.json")
  if (!existsSync(configPath)) {
    error("components.json not found. Run `uilibrary init` first.")
  }
  return JSON.parse(readFileSync(configPath, "utf-8"))
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(dirname(dest))
  copyFileSync(src, dest)
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdInit() {
  const cwd = process.cwd()
  const configDest = join(cwd, "components.json")

  if (existsSync(configDest)) {
    warn("components.json already exists. Skipping.")
  } else {
    copyFile(join(PKG_ROOT, "templates", "components.json"), configDest)
    success("Created components.json")
  }

  // Copy base CSS (Tailwind v4 — all config lives in CSS)
  const cssDest = join(cwd, "src", "base.css")
  if (!existsSync(cssDest)) {
    copyFile(join(PKG_ROOT, "src", "base.css"), cssDest)
    success("Created src/base.css (Tailwind v4 — @theme + CSS variables)")
  }

  console.log()
  info("Project initialized with Tailwind CSS v4!")
  console.log()
  console.log(`  ${c.dim}Build CSS:${c.reset}  npx @tailwindcss/cli -i src/base.css -o dist/output.css --watch`)
  console.log()
  console.log(`  ${c.dim}Add components:${c.reset}`)
  console.log(`  ${c.bold}npx uilibrary add button${c.reset}`)
  console.log(`  ${c.bold}npx uilibrary add modal accordion${c.reset}`)
  console.log()
}

function cmdAdd(componentNames) {
  if (componentNames.length === 0) {
    error("Please specify at least one component. Example: uilibrary add button")
  }

  const registry = loadRegistry()
  const config = loadConfig()
  const cwd = process.cwd()
  const controllersDir = resolve(cwd, config.aliases.controllers)
  const componentsDir = resolve(cwd, config.aliases.components)

  // Resolve all dependencies
  const toInstall = new Set()

  function resolveDeps(name) {
    if (toInstall.has(name)) return
    const comp = registry.components[name]
    if (!comp) {
      warn(`Component "${name}" not found in registry. Skipping.`)
      return
    }
    for (const dep of comp.dependencies) {
      resolveDeps(dep)
    }
    toInstall.add(name)
  }

  for (const name of componentNames) {
    resolveDeps(name)
  }

  // Install each component
  let installed = 0
  for (const name of toInstall) {
    const comp = registry.components[name]
    const files = comp.files

    // Copy controller JS (if exists)
    if (files.controller) {
      const src = join(PKG_ROOT, files.controller)
      const dest = join(controllersDir, basename(files.controller))
      if (existsSync(dest)) {
        warn(`${config.aliases.controllers}/${basename(files.controller)} already exists. Skipping.`)
      } else {
        copyFile(src, dest)
        success(`Added ${c.bold}${config.aliases.controllers}/${basename(files.controller)}${c.reset}`)
      }
    }

    // Copy HTML template
    if (files.template) {
      const src = join(PKG_ROOT, files.template)
      const dest = join(componentsDir, basename(files.template))
      if (existsSync(dest)) {
        warn(`${config.aliases.components}/${basename(files.template)} already exists. Skipping.`)
      } else {
        copyFile(src, dest)
        success(`Added ${c.bold}${config.aliases.components}/${basename(files.template)}${c.reset}`)
      }
    }

    installed++
  }

  if (installed > 0) {
    console.log()
    info(`Installed ${installed} component${installed > 1 ? "s" : ""}.`)

    // Show registration hint
    const controllers = [...toInstall]
      .map(n => registry.components[n])
      .filter(comp => comp.files.controller)

    if (controllers.length > 0) {
      console.log()
      console.log(`${c.dim}Register the controller(s) in your application:${c.reset}`)
      console.log()
      for (const comp of controllers) {
        const name = comp.name
        const pascalName = name.charAt(0).toUpperCase() + name.slice(1)
        console.log(`  ${c.gray}import ${pascalName}Controller from "./${config.aliases.controllers}/${name}.js"${c.reset}`)
        console.log(`  ${c.gray}application.register("${name}", ${pascalName}Controller)${c.reset}`)
        console.log()
      }
    }
  }
}

function cmdList() {
  const registry = loadRegistry()
  const components = Object.values(registry.components)

  console.log()
  console.log(`${c.bold}Available components (${components.length}):${c.reset}`)
  console.log()

  const maxName = Math.max(...components.map(c => c.name.length))

  for (const comp of components) {
    const hasCtrl = comp.files.controller ? `${c.cyan}JS${c.reset}` : `${c.dim}--${c.reset}`
    const deps = comp.dependencies.length > 0
      ? `${c.dim}deps: ${comp.dependencies.join(", ")}${c.reset}`
      : ""
    console.log(`  ${c.green}${comp.name.padEnd(maxName + 2)}${c.reset} ${hasCtrl}  ${comp.description} ${deps}`)
  }

  console.log()
  console.log(`${c.dim}Usage: uilibrary add <component> [component...]${c.reset}`)
  console.log()
}

function cmdDiff(componentNames) {
  if (componentNames.length === 0) {
    error("Please specify at least one component. Example: uilibrary diff button")
  }

  const registry = loadRegistry()
  const config = loadConfig()
  const cwd = process.cwd()
  const controllersDir = resolve(cwd, config.aliases.controllers)

  for (const name of componentNames) {
    const comp = registry.components[name]
    if (!comp) {
      warn(`Component "${name}" not found in registry.`)
      continue
    }
    if (!comp.files.controller) {
      info(`${name} has no controller file.`)
      continue
    }

    const localPath = join(controllersDir, basename(comp.files.controller))
    const registryPath = join(PKG_ROOT, comp.files.controller)

    if (!existsSync(localPath)) {
      info(`${name}: not installed locally.`)
      continue
    }

    const local = readFileSync(localPath, "utf-8")
    const remote = readFileSync(registryPath, "utf-8")

    if (local === remote) {
      success(`${name}: no differences.`)
    } else {
      warn(`${name}: local version differs from registry.`)
    }
  }
}

// ─── CLI Router ──────────────────────────────────────────────────────────────

const [,, command, ...args] = process.argv

switch (command) {
  case "init":
    cmdInit()
    break
  case "add":
    cmdAdd(args)
    break
  case "list":
    cmdList()
    break
  case "diff":
    cmdDiff(args)
    break
  case "help":
  case "--help":
  case "-h":
  case undefined:
    console.log(`
${c.bold}uilibrary${c.reset} — shadcn-style UI components for Stimulus + Tailwind

${c.bold}Usage:${c.reset}
  uilibrary init                   Initialize project (creates components.json, base CSS, tailwind config)
  uilibrary add <name> [name...]   Add component(s) to your project
  uilibrary list                   List all available components
  uilibrary diff <name>            Check if a local component differs from the registry

${c.bold}Examples:${c.reset}
  uilibrary init
  uilibrary add button modal accordion
  uilibrary list
`)
    break
  default:
    error(`Unknown command: "${command}". Run uilibrary --help for usage.`)
}
