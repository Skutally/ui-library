import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
