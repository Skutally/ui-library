import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
