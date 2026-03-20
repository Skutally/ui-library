import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
