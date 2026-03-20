import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
