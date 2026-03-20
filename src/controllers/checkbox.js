import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["icon"]
  static values = {
    checked: { type: Boolean, default: false },
  }

  connect() {
    this.render()
  }

  toggle() {
    this.checkedValue = !this.checkedValue
    this.render()
    this.dispatch("change", { detail: { checked: this.checkedValue } })
  }

  render() {
    const on = this.checkedValue
    const box = this.element.querySelector("[role=checkbox]")
    if (box) {
      box.setAttribute("aria-checked", on)
      box.classList.toggle("bg-primary", on)
      box.classList.toggle("text-primary-foreground", on)
      box.classList.toggle("border-primary", on)
      box.classList.toggle("border-border", !on)
    }
    if (this.hasIconTarget) {
      this.iconTarget.classList.toggle("hidden", !on)
    }
  }
}
