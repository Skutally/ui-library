import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
