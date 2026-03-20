import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["option", "dot"]
  static values = {
    selected: { type: Number, default: -1 },
  }

  connect() {
    if (this.selectedValue >= 0) this.render()
  }

  select(e) {
    this.selectedValue = this.optionTargets.indexOf(e.currentTarget)
    this.render()
    this.dispatch("change", { detail: { selected: this.selectedValue } })
  }

  render() {
    this.optionTargets.forEach((opt, i) => {
      const active = i === this.selectedValue
      const ring = opt.querySelector("[data-radio-target='dot']")
      if (ring) {
        ring.classList.toggle("border-primary", active)
        const inner = ring.querySelector("span")
        if (inner) inner.classList.toggle("hidden", !active)
      }
    })
  }
}
