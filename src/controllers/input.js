import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
