import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]

  connect() {
    this.idx = 0
    this.render()
  }

  switch(e) {
    this.idx = this.tabTargets.indexOf(e.currentTarget)
    this.render()
  }

  render() {
    this.tabTargets.forEach((t, i) => {
      const active = i === this.idx
      t.classList.toggle("border-foreground", active)
      t.classList.toggle("text-foreground", active)
      t.classList.toggle("font-semibold", active)
      t.classList.toggle("bg-background", active)
      t.classList.toggle("border-transparent", !active)
      t.classList.toggle("text-muted-foreground", !active)
      t.classList.toggle("font-medium", !active)
    })
    this.panelTargets.forEach((p, i) => p.classList.toggle("hidden", i !== this.idx))
  }
}
