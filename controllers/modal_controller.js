const { Application, Controller } = Stimulus;
const app = Application.start();

class ModalController extends Controller {
  static targets = ["overlay","box"]

  connect() {
    this._key = e => { if (e.key === "Escape") this.close() }
    document.addEventListener("keydown", this._key)
  }

  disconnect() {
    document.removeEventListener("keydown", this._key)
  }

  open() {
    this.overlayTarget.classList.remove("hidden")
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      this.boxTarget.querySelector("button, input")?.focus()
    })
  }

  close() {
    this.overlayTarget.classList.add("hidden")
    document.body.style.overflow = ""
  }

  backdrop(e) {
    if (e.target === this.overlayTarget) this.close()
  }
}

app.register("modal", ModalController);
