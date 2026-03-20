import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
