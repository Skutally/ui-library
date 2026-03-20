import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "body", "icon"]

  connect() {
    this.openIndex = -1
  }

  toggle(e) {
    const button = e.currentTarget
    const item = button.closest("[data-accordion-item]")
    const body = item.querySelector("[data-accordion-target='body']")
    const icon = item.querySelector("[data-accordion-target='icon']")
    const isOpen = !body.classList.contains("hidden")

    // Close all
    this.element.querySelectorAll("[data-accordion-target='body']").forEach(b => b.classList.add("hidden"))
    this.element.querySelectorAll("[data-accordion-target='icon']").forEach(i => i.style.transform = "")

    // Open clicked if was closed
    if (!isOpen) {
      body.classList.remove("hidden")
      if (icon) icon.style.transform = "rotate(180deg)"
    }
  }
}
