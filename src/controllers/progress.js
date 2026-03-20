import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bar"]
  static values = {
    value: { type: Number, default: 0 },
  }

  connect() {
    this.render()
  }

  render() {
    const pct = Math.min(100, Math.max(0, this.valueValue))
    this.barTarget.style.width = `${pct}%`
    this.element.setAttribute("aria-valuenow", pct)
  }

  valueValueChanged() {
    this.render()
  }
}
