
const { Application, Controller } = Stimulus;
const app = Application.start();

class AccordionController extends Controller {
  static targets = ["body","icon"]

  connect() { this.open = false }

  toggle() {
    this.open = !this.open
    this.bodyTarget.classList.toggle("hidden", !this.open)
    this.iconTarget.style.transform = this.open ? "rotate(180deg)" : ""
  }
}

app.register("accordion", AccordionController);