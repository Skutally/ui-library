/**
 * uilibrary — Component Controllers
 *
 * Single entry point for the demo page.
 * Loads Stimulus from the global UMD build and registers every controller.
 *
 * Usage (CDN):
 *   <script src="https://cdn.jsdelivr.net/npm/@hotwired/stimulus/dist/stimulus.umd.js"></script>
 *   <script src="src/controllers.js"></script>
 */

const { Application, Controller } = Stimulus
const application = Application.start()

/* ───────────────────────────── Dark Mode ──────────────────────────── */

class DarkmodeController extends Controller {
  static targets = ["sun", "moon"]

  connect() {
    const saved = localStorage.getItem("theme")
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
    }
    this.render()
  }

  toggle() {
    document.documentElement.classList.toggle("dark")
    const isDark = document.documentElement.classList.contains("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
    this.render()
  }

  render() {
    const isDark = document.documentElement.classList.contains("dark")
    if (this.hasSunTarget && this.hasMoonTarget) {
      this.sunTarget.classList.toggle("hidden", isDark)
      this.moonTarget.classList.toggle("hidden", !isDark)
    }
  }
}

/* ───────────────────────── Preview / Code Toggle ─────────────────── */

class PreviewController extends Controller {
  static targets = ["preview", "code", "previewTab", "codeTab", "copyBtn", "raw"]

  showPreview() {
    this.previewTarget.classList.remove("hidden")
    this.codeTarget.classList.add("hidden")
    this.previewTabTarget.classList.add("bg-accent", "text-accent-foreground")
    this.previewTabTarget.classList.remove("text-muted-foreground")
    this.codeTabTarget.classList.remove("bg-accent", "text-accent-foreground")
    this.codeTabTarget.classList.add("text-muted-foreground")
  }

  showCode() {
    this.previewTarget.classList.add("hidden")
    this.codeTarget.classList.remove("hidden")
    this.codeTabTarget.classList.add("bg-accent", "text-accent-foreground")
    this.codeTabTarget.classList.remove("text-muted-foreground")
    this.previewTabTarget.classList.remove("bg-accent", "text-accent-foreground")
    this.previewTabTarget.classList.add("text-muted-foreground")
  }

  copy() {
    const text = this.hasRawTarget ? this.rawTarget.value : this.previewTarget.innerHTML
    navigator.clipboard.writeText(text).then(() => {
      const btn = this.copyBtnTarget
      const original = btn.innerHTML
      btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!`
      setTimeout(() => { btn.innerHTML = original }, 2000)
    })
  }
}

/* ───────────────────────────── Search ─────────────────────────────── */

class SearchController extends Controller {
  connect() {
    this._keydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        this.open()
      }
    }
    document.addEventListener("keydown", this._keydown)
  }

  disconnect() {
    document.removeEventListener("keydown", this._keydown)
  }

  open() {
    if (document.getElementById("search-modal")) return
    const sections = document.querySelectorAll("[data-component]")
    let items = ""
    sections.forEach(s => {
      const label = s.dataset.label || s.dataset.component
      const id = s.id
      items += `<a href="#${id}" class="search-item flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-md transition-colors" data-label="${label.toLowerCase()}" onclick="document.getElementById('search-modal').remove()">
        <svg class="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
        <span>${label}</span>
      </a>`
    })

    const modal = document.createElement("div")
    modal.id = "search-modal"
    modal.className = "fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
      <div class="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        <div class="flex items-center border-b border-border px-4">
          <svg class="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input id="search-input" type="text" placeholder="Search components..." class="flex-1 bg-transparent border-0 px-3 py-3 text-sm outline-none placeholder:text-muted-foreground" oninput="filterSearch(this.value)" autofocus />
          <kbd class="pointer-events-none inline-flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">ESC</kbd>
        </div>
        <div id="search-results" class="max-h-72 overflow-y-auto p-2">${items}</div>
      </div>
    `
    document.body.appendChild(modal)
    document.getElementById("search-input").focus()
    const escHandler = (e) => {
      if (e.key === "Escape") { modal.remove(); document.removeEventListener("keydown", escHandler) }
    }
    document.addEventListener("keydown", escHandler)
  }
}

// Global search filter function
window.filterSearch = function(query) {
  const items = document.querySelectorAll(".search-item")
  const q = query.toLowerCase()
  items.forEach(item => {
    item.style.display = item.dataset.label.includes(q) ? "" : "none"
  })
}

/* ───────────────────────────── Accordion ───────────────────────────── */

class AccordionController extends Controller {
  static targets = ["item", "body", "icon"]

  connect() {
    this.openIndex = -1
  }

  toggle(e) {
    const button = e.currentTarget
    const item = button.closest("[data-accordion-item]")
    const body = item.querySelector("[data-accordion-target='body']")
    const icon = item.querySelector("[data-accordion-target='icon']")
    const isOpen = !body.classList.contains("hidden")

    // Close all
    this.element.querySelectorAll("[data-accordion-target='body']").forEach(b => b.classList.add("hidden"))
    this.element.querySelectorAll("[data-accordion-target='icon']").forEach(i => i.style.transform = "")

    // Open clicked if was closed
    if (!isOpen) {
      body.classList.remove("hidden")
      if (icon) icon.style.transform = "rotate(180deg)"
    }
  }
}

/* ───────────────────────────── Alert ───────────────────────────────── */

class AlertController extends Controller {
  static values = {
    variant: { type: String, default: "info" },
    dismissible: { type: Boolean, default: true },
  }

  connect() {
    this.applyVariant()
    if (this.dismissibleValue) this.addCloseButton()
  }

  applyVariant() {
    const base = "relative flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-all [&>svg]:shrink-0 [&>svg]:mt-0.5"
    const map = {
      info:    "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200",
      success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200",
      warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200",
      danger:  "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200",
    }
    this.element.className = `${base} ${map[this.variantValue] ?? map.info}`
  }

  addCloseButton() {
    if (this.element.querySelector("[data-alert-close]")) return
    const btn = document.createElement("button")
    btn.setAttribute("data-alert-close", "")
    btn.className = "absolute top-3 right-3 text-lg leading-none opacity-40 hover:opacity-80 cursor-pointer"
    btn.textContent = "\u2715"
    btn.addEventListener("click", () => this.dismiss())
    this.element.appendChild(btn)
  }

  dismiss() {
    this.element.classList.add("opacity-0", "-translate-y-1")
    setTimeout(() => this.element.remove(), 200)
  }
}

/* ───────────────────────────── Badge ───────────────────────────────── */

class BadgeController extends Controller {
  static values = {
    variant: { type: String, default: "default" },
    dot: { type: Boolean, default: false },
  }

  connect() {
    this.applyVariant()
    if (this.dotValue) this.prependDot()
  }

  applyVariant() {
    const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors"
    const map = {
      default:     "bg-primary text-primary-foreground",
      secondary:   "bg-muted text-muted-foreground",
      success:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      warning:     "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      danger:      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      info:        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      outline:     "bg-transparent border border-border text-foreground",
    }
    this.element.className = `${base} ${map[this.variantValue] ?? map.default}`
  }

  prependDot() {
    if (this.element.querySelector("[data-badge-dot]")) return
    const dot = document.createElement("span")
    dot.setAttribute("data-badge-dot", "")
    const colors = {
      default: "bg-primary-foreground", secondary: "bg-muted-foreground",
      success: "bg-emerald-500", warning: "bg-amber-500",
      danger: "bg-red-500", info: "bg-blue-500", outline: "bg-foreground",
    }
    dot.className = `w-1.5 h-1.5 rounded-full ${colors[this.variantValue] ?? colors.default}`
    this.element.prepend(dot)
  }
}

/* ───────────────────────────── Button ──────────────────────────────── */

class ButtonController extends Controller {
  static values = {
    variant:     { type: String,  default: "default" },
    size:        { type: String,  default: "default" },
    loading:     { type: Boolean, default: false },
    loadingText: { type: String,  default: "Loading..." },
    clickable:   { type: Boolean, default: false },
  }

  connect() {
    this._originalHTML = this.element.innerHTML
    this.applyBase()
    this.applyVariant()
    this.applySize()
    if (this.loadingValue) this.setLoading(true)
    if (this.clickableValue) {
      this.element.addEventListener("click", () => this.handleClick())
    }
  }

  applyBase() {
    this.element.classList.add(
      "inline-flex", "items-center", "justify-center", "gap-2",
      "whitespace-nowrap", "rounded-md", "text-sm", "font-medium",
      "transition-colors", "cursor-pointer", "focus-visible:outline-none",
      "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2",
      "disabled:pointer-events-none", "disabled:opacity-50"
    )
  }

  applyVariant() {
    const map = {
      default:     ["bg-primary", "text-primary-foreground", "hover:bg-primary/90"],
      destructive: ["bg-red-600", "text-white", "hover:bg-red-700", "dark:bg-red-700", "dark:hover:bg-red-800"],
      outline:     ["border", "border-border", "bg-background", "hover:bg-accent", "hover:text-accent-foreground"],
      secondary:   ["bg-muted", "text-foreground", "hover:bg-muted/80"],
      ghost:       ["hover:bg-accent", "hover:text-accent-foreground"],
      link:        ["text-primary", "underline-offset-4", "hover:underline"],
      success:     ["bg-emerald-600", "text-white", "hover:bg-emerald-700"],
      warning:     ["bg-amber-500", "text-white", "hover:bg-amber-600"],
    }
    this.element.classList.add(...(map[this.variantValue] ?? map.default))
  }

  applySize() {
    const map = {
      xs:      ["h-7", "px-2.5", "text-xs", "rounded"],
      sm:      ["h-8", "px-3", "text-xs", "rounded-md"],
      default: ["h-9", "px-4", "py-2"],
      lg:      ["h-11", "px-6", "text-base"],
      xl:      ["h-12", "px-8", "text-lg", "rounded-lg"],
      icon:    ["h-9", "w-9", "p-0"],
    }
    this.element.classList.add(...(map[this.sizeValue] ?? map.default))
  }

  setLoading(on) {
    if (on) {
      this.element.disabled = true
      this.element.innerHTML = `
        <svg class="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
          <path d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" fill="currentColor" class="opacity-75"/>
        </svg>
        ${this.loadingTextValue}`
    } else {
      this.element.disabled = false
      this.element.innerHTML = this._originalHTML
    }
  }

  handleClick() {
    if (this.element.disabled) return
    this.setLoading(true)
    setTimeout(() => this.setLoading(false), 2000)
  }
}

/* ───────────────────────────── Card ───────────────────────────────── */

class CardController extends Controller {
  connect() {
    this.element.classList.add(
      "rounded-lg", "border", "border-border", "bg-card",
      "text-card-foreground", "shadow-sm"
    )
  }
}

/* ───────────────────────────── Dropdown ────────────────────────────── */

class DropdownController extends Controller {
  static targets = ["menu"]

  connect() {
    this._outside = (e) => { if (!this.element.contains(e.target)) this.close() }
    this._escape  = (e) => { if (e.key === "Escape") this.close() }
    document.addEventListener("click", this._outside)
    document.addEventListener("keydown", this._escape)
  }

  disconnect() {
    document.removeEventListener("click", this._outside)
    document.removeEventListener("keydown", this._escape)
  }

  toggle() {
    this.menuTarget.classList.contains("hidden") ? this.open() : this.close()
  }

  open() {
    this.menuTarget.classList.remove("hidden")
    requestAnimationFrame(() => {
      this.menuTarget.classList.remove("opacity-0", "scale-95")
      this.menuTarget.classList.add("opacity-100", "scale-100")
    })
  }

  close() {
    this.menuTarget.classList.add("opacity-0", "scale-95")
    this.menuTarget.classList.remove("opacity-100", "scale-100")
    setTimeout(() => this.menuTarget.classList.add("hidden"), 100)
  }
}

/* ───────────────────────────── Input ───────────────────────────────── */

class InputController extends Controller {
  static values = {
    variant: { type: String, default: "default" },
    icon: { type: Boolean, default: false },
  }

  connect() {
    this.applyVariant()
  }

  applyVariant() {
    const base = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    const map = {
      default: "border-border bg-background",
      error:   "border-red-400 bg-red-50 text-red-900 focus-visible:ring-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
      success: "border-emerald-400 bg-emerald-50 text-emerald-900 focus-visible:ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    }
    const variant = map[this.variantValue] ?? map.default
    const iconPad = this.iconValue ? "pl-9" : ""
    this.element.className = `${base} ${variant} ${iconPad}`.trim()
  }
}

/* ───────────────────────────── Modal ───────────────────────────────── */

class ModalController extends Controller {
  static targets = ["overlay", "box"]

  connect() {
    this._key = (e) => { if (e.key === "Escape") this.close() }
    document.addEventListener("keydown", this._key)
  }

  disconnect() {
    document.removeEventListener("keydown", this._key)
  }

  open() {
    this.overlayTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      this.overlayTarget.classList.remove("opacity-0")
      this.boxTarget.classList.remove("scale-95", "opacity-0")
      this.boxTarget.classList.add("scale-100", "opacity-100")
      this.boxTarget.querySelector("button, input")?.focus()
    })
  }

  close() {
    this.overlayTarget.classList.add("opacity-0")
    this.boxTarget.classList.add("scale-95", "opacity-0")
    this.boxTarget.classList.remove("scale-100", "opacity-100")
    setTimeout(() => {
      this.overlayTarget.classList.add("hidden")
      document.body.style.overflow = ""
    }, 200)
  }

  backdrop(e) {
    if (e.target === this.overlayTarget) this.close()
  }
}

/* ───────────────────────────── Tabs ────────────────────────────────── */

class TabsController extends Controller {
  static targets = ["tab", "panel"]

  connect() {
    this.idx = 0
    this.render()
  }

  switch(e) {
    this.idx = this.tabTargets.indexOf(e.currentTarget)
    this.render()
  }

  render() {
    this.tabTargets.forEach((t, i) => {
      const active = i === this.idx
      t.classList.toggle("border-foreground", active)
      t.classList.toggle("text-foreground", active)
      t.classList.toggle("font-semibold", active)
      t.classList.toggle("bg-background", active)
      t.classList.toggle("border-transparent", !active)
      t.classList.toggle("text-muted-foreground", !active)
      t.classList.toggle("font-medium", !active)
    })
    this.panelTargets.forEach((p, i) => p.classList.toggle("hidden", i !== this.idx))
  }
}

/* ───────────────────────────── Toast ───────────────────────────────── */

class ToastController extends Controller {
  static targets = ["container"]

  show({ params: { type = "info", msg = "Notification" } }) {
    const map = {
      info:    { ring: "bg-background border-border text-foreground",               dot: "bg-blue-500" },
      success: { ring: "bg-background border-border text-foreground",               dot: "bg-emerald-500" },
      warning: { ring: "bg-background border-border text-foreground",               dot: "bg-amber-500" },
      danger:  { ring: "bg-background border-border text-foreground",               dot: "bg-red-500" },
    }
    const cfg = map[type] ?? map.info
    const el = document.createElement("div")
    el.className = `flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-lg ${cfg.ring} transition-all duration-300 opacity-0 translate-y-2`
    el.innerHTML = `
      <span class="w-2 h-2 rounded-full shrink-0 ${cfg.dot}"></span>
      <span class="flex-1">${this._escape(msg)}</span>
      <button class="text-lg leading-none opacity-40 hover:opacity-80 ml-1 cursor-pointer">\u2715</button>`
    el.querySelector("button").addEventListener("click", () => this._dismiss(el))
    this.containerTarget.appendChild(el)
    requestAnimationFrame(() => {
      el.classList.replace("opacity-0", "opacity-100")
      el.classList.replace("translate-y-2", "translate-y-0")
    })
    setTimeout(() => this._dismiss(el), 4000)
  }

  _dismiss(el) {
    if (!el.parentNode) return
    el.classList.replace("opacity-100", "opacity-0")
    el.classList.add("-translate-y-1")
    setTimeout(() => el.remove(), 300)
  }

  _escape(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}

/* ───────────────────────────── Toggle / Switch ──────────────────────── */

class ToggleController extends Controller {
  static targets = ["track", "thumb"]
  static values = {
    checked: { type: Boolean, default: false },
  }

  connect() {
    this.render()
  }

  flip() {
    this.checkedValue = !this.checkedValue
    this.render()
    this.dispatch("change", { detail: { checked: this.checkedValue } })
  }

  render() {
    const on = this.checkedValue
    const btn = this.element.querySelector("[role=switch]")
    if (btn) btn.setAttribute("aria-checked", on)
    this.trackTarget.classList.toggle("bg-primary", on)
    this.trackTarget.classList.toggle("bg-muted", !on)
    this.thumbTarget.style.transform = on ? "translateX(20px)" : "translateX(0)"
  }
}

/* ───────────────────────────── Tooltip ─────────────────────────────── */

class TooltipController extends Controller {
  static targets = ["content"]
  static values = {
    position: { type: String, default: "top" },
  }

  show() {
    this.contentTarget.classList.remove("hidden", "opacity-0")
    this.contentTarget.classList.add("opacity-100")
  }

  hide() {
    this.contentTarget.classList.remove("opacity-100")
    this.contentTarget.classList.add("opacity-0")
    setTimeout(() => this.contentTarget.classList.add("hidden"), 150)
  }
}

/* ───────────────────────────── Popover ─────────────────────────────── */

class PopoverController extends Controller {
  static targets = ["content"]

  connect() {
    this._outside = (e) => { if (!this.element.contains(e.target)) this.close() }
    this._escape  = (e) => { if (e.key === "Escape") this.close() }
    document.addEventListener("click", this._outside)
    document.addEventListener("keydown", this._escape)
  }

  disconnect() {
    document.removeEventListener("click", this._outside)
    document.removeEventListener("keydown", this._escape)
  }

  toggle() {
    this.contentTarget.classList.contains("hidden") ? this.open() : this.close()
  }

  open() {
    this.contentTarget.classList.remove("hidden")
    requestAnimationFrame(() => {
      this.contentTarget.classList.remove("opacity-0", "scale-95")
      this.contentTarget.classList.add("opacity-100", "scale-100")
    })
  }

  close() {
    this.contentTarget.classList.add("opacity-0", "scale-95")
    this.contentTarget.classList.remove("opacity-100", "scale-100")
    setTimeout(() => this.contentTarget.classList.add("hidden"), 100)
  }
}

/* ───────────────────────────── Sheet / Drawer ────────────────────────── */

class SheetController extends Controller {
  static targets = ["overlay", "panel"]
  static values = {
    side: { type: String, default: "right" },
  }

  open() {
    this.overlayTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      this.overlayTarget.classList.remove("opacity-0")
      this.panelTarget.classList.remove(this._hiddenTransform())
      this.panelTarget.classList.add("translate-x-0", "translate-y-0")
    })
  }

  close() {
    this.overlayTarget.classList.add("opacity-0")
    this.panelTarget.classList.remove("translate-x-0", "translate-y-0")
    this.panelTarget.classList.add(this._hiddenTransform())
    setTimeout(() => {
      this.overlayTarget.classList.add("hidden")
      document.body.style.overflow = ""
    }, 300)
  }

  backdrop(e) {
    if (e.target === this.overlayTarget) this.close()
  }

  _hiddenTransform() {
    const map = { right: "translate-x-full", left: "-translate-x-full", top: "-translate-y-full", bottom: "translate-y-full" }
    return map[this.sideValue] || "translate-x-full"
  }
}

/* ───────────────────────────── Checkbox ──────────────────────────────── */

class CheckboxController extends Controller {
  static targets = ["icon"]
  static values = {
    checked: { type: Boolean, default: false },
  }

  connect() {
    this.render()
  }

  toggle() {
    this.checkedValue = !this.checkedValue
    this.render()
    this.dispatch("change", { detail: { checked: this.checkedValue } })
  }

  render() {
    const on = this.checkedValue
    const box = this.element.querySelector("[role=checkbox]")
    if (box) {
      box.setAttribute("aria-checked", on)
      box.classList.toggle("bg-primary", on)
      box.classList.toggle("text-primary-foreground", on)
      box.classList.toggle("border-primary", on)
      box.classList.toggle("border-border", !on)
    }
    if (this.hasIconTarget) {
      this.iconTarget.classList.toggle("hidden", !on)
    }
  }
}

/* ───────────────────────────── Radio Group ───────────────────────────── */

class RadioController extends Controller {
  static targets = ["option", "dot"]
  static values = {
    selected: { type: Number, default: -1 },
  }

  connect() {
    if (this.selectedValue >= 0) this.render()
  }

  select(e) {
    this.selectedValue = this.optionTargets.indexOf(e.currentTarget)
    this.render()
    this.dispatch("change", { detail: { selected: this.selectedValue } })
  }

  render() {
    this.optionTargets.forEach((opt, i) => {
      const active = i === this.selectedValue
      const ring = opt.querySelector("[data-radio-target='dot']")
      if (ring) {
        ring.classList.toggle("border-primary", active)
        const inner = ring.querySelector("span")
        if (inner) inner.classList.toggle("hidden", !active)
      }
    })
  }
}

/* ───────────────────────────── Progress ──────────────────────────────── */

class ProgressController extends Controller {
  static targets = ["bar"]
  static values = {
    value: { type: Number, default: 0 },
  }

  connect() {
    this.render()
  }

  render() {
    const pct = Math.min(100, Math.max(0, this.valueValue))
    this.barTarget.style.width = `${pct}%`
    this.element.setAttribute("aria-valuenow", pct)
  }

  valueValueChanged() {
    this.render()
  }
}

/* ───────────────────────────── Slider ────────────────────────────────── */

class SliderController extends Controller {
  static targets = ["track", "fill", "thumb", "output"]
  static values = {
    min:  { type: Number, default: 0 },
    max:  { type: Number, default: 100 },
    val:  { type: Number, default: 50 },
    step: { type: Number, default: 1 },
  }

  connect() {
    this._dragging = false
    this._onMove = (e) => this._handleMove(e)
    this._onUp   = () => this._handleUp()
    this.render()
  }

  startDrag(e) {
    e.preventDefault()
    this._dragging = true
    document.addEventListener("mousemove", this._onMove)
    document.addEventListener("mouseup", this._onUp)
    document.addEventListener("touchmove", this._onMove)
    document.addEventListener("touchend", this._onUp)
    this._handleMove(e)
  }

  _handleMove(e) {
    if (!this._dragging) return
    const rect = this.trackTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    const range = this.maxValue - this.minValue
    let val = this.minValue + pct * range
    val = Math.round(val / this.stepValue) * this.stepValue
    this.valValue = Math.max(this.minValue, Math.min(this.maxValue, val))
    this.render()
    this.dispatch("change", { detail: { value: this.valValue } })
  }

  _handleUp() {
    this._dragging = false
    document.removeEventListener("mousemove", this._onMove)
    document.removeEventListener("mouseup", this._onUp)
    document.removeEventListener("touchmove", this._onMove)
    document.removeEventListener("touchend", this._onUp)
  }

  render() {
    const pct = ((this.valValue - this.minValue) / (this.maxValue - this.minValue)) * 100
    if (this.hasFillTarget) this.fillTarget.style.width = `${pct}%`
    if (this.hasThumbTarget) this.thumbTarget.style.left = `${pct}%`
    if (this.hasOutputTarget) this.outputTarget.textContent = this.valValue
  }
}

/* ───────────────────────────── Table Sort ────────────────────────────── */

class TableController extends Controller {
  static targets = ["header", "body"]

  sort(e) {
    const th = e.currentTarget
    const col = parseInt(th.dataset.col)
    const dir = th.dataset.dir === "asc" ? "desc" : "asc"

    // Reset all headers
    this.headerTargets.forEach(h => { h.dataset.dir = ""; h.querySelector("[data-sort-icon]")?.classList.add("opacity-0") })
    th.dataset.dir = dir
    const icon = th.querySelector("[data-sort-icon]")
    if (icon) {
      icon.classList.remove("opacity-0")
      icon.style.transform = dir === "desc" ? "rotate(180deg)" : ""
    }

    const rows = Array.from(this.bodyTarget.querySelectorAll("tr"))
    rows.sort((a, b) => {
      const aVal = a.children[col]?.textContent.trim() ?? ""
      const bVal = b.children[col]?.textContent.trim() ?? ""
      const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ""))
      const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ""))
      if (!isNaN(aNum) && !isNaN(bNum)) return dir === "asc" ? aNum - bNum : bNum - aNum
      return dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    rows.forEach(r => this.bodyTarget.appendChild(r))
  }
}

/* ───────────────── Register all controllers ───────────────────────── */

application.register("darkmode",   DarkmodeController)
application.register("preview",    PreviewController)
application.register("search",     SearchController)
application.register("accordion",  AccordionController)
application.register("alert",      AlertController)
application.register("badge",      BadgeController)
application.register("button",     ButtonController)
application.register("card",       CardController)
application.register("dropdown",   DropdownController)
application.register("input",      InputController)
application.register("modal",      ModalController)
application.register("tabs",       TabsController)
application.register("toast",      ToastController)
application.register("toggle",     ToggleController)
application.register("tooltip",    TooltipController)
application.register("popover",    PopoverController)
application.register("sheet",      SheetController)
application.register("checkbox",   CheckboxController)
application.register("radio",      RadioController)
application.register("progress",   ProgressController)
application.register("slider",     SliderController)
application.register("table",      TableController)
