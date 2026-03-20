import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["track", "thumb"]
  static values = {
    checked: { type: Boolean, default: false },
  }

  connect() {
    this.render()
  }

  flip() {
    this.checkedValue = !this.checkedValue
    this.render()
    this.dispatch("change", { detail: { checked: this.checkedValue } })
  }

  render() {
    const on = this.checkedValue
    const btn = this.element.querySelector("[role=switch]")
    if (btn) btn.setAttribute("aria-checked", on)
    this.trackTarget.classList.toggle("bg-primary", on)
    this.trackTarget.classList.toggle("bg-muted", !on)
    this.thumbTarget.style.transform = on ? "translateX(20px)" : "translateX(0)"
  }
}
