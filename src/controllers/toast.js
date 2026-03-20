import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
