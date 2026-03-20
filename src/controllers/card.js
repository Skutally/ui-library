import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.classList.add(
      "rounded-lg", "border", "border-border", "bg-card",
      "text-card-foreground", "shadow-sm"
    )
  }
}
