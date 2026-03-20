import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
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
