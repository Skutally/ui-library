import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["track", "fill", "thumb", "output"]
  static values = {
    min:  { type: Number, default: 0 },
    max:  { type: Number, default: 100 },
    val:  { type: Number, default: 50 },
    step: { type: Number, default: 1 },
  }

  connect() {
    this._dragging = false
    this._onMove = (e) => this._handleMove(e)
    this._onUp   = () => this._handleUp()
    this.render()
  }

  startDrag(e) {
    e.preventDefault()
    this._dragging = true
    document.addEventListener("mousemove", this._onMove)
    document.addEventListener("mouseup", this._onUp)
    document.addEventListener("touchmove", this._onMove)
    document.addEventListener("touchend", this._onUp)
    this._handleMove(e)
  }

  _handleMove(e) {
    if (!this._dragging) return
    const rect = this.trackTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    const range = this.maxValue - this.minValue
    let val = this.minValue + pct * range
    val = Math.round(val / this.stepValue) * this.stepValue
    this.valValue = Math.max(this.minValue, Math.min(this.maxValue, val))
    this.render()
    this.dispatch("change", { detail: { value: this.valValue } })
  }

  _handleUp() {
    this._dragging = false
    document.removeEventListener("mousemove", this._onMove)
    document.removeEventListener("mouseup", this._onUp)
    document.removeEventListener("touchmove", this._onMove)
    document.removeEventListener("touchend", this._onUp)
  }

  render() {
    const pct = ((this.valValue - this.minValue) / (this.maxValue - this.minValue)) * 100
    if (this.hasFillTarget) this.fillTarget.style.width = `${pct}%`
    if (this.hasThumbTarget) this.thumbTarget.style.left = `${pct}%`
    if (this.hasOutputTarget) this.outputTarget.textContent = this.valValue
  }
}
