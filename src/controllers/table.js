import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
