
const { Application, Controller } = Stimulus;
const app = Application.start();

class DropdownController extends Controller {
  static targets = ["menu"]

  connect() {
    this._outside = e => { if (!this.element.contains(e.target)) this.close() }
    this._escape  = e => { if (e.key === "Escape") this.close() }
    document.addEventListener("click",   this._outside)
    document.addEventListener("keydown", this._escape)
  }

  disconnect() {
    document.removeEventListener("click",   this._outside)
    document.removeEventListener("keydown", this._escape)
  }

  toggle() { this.menuTarget.classList.contains("hidden") ? this.open() : this.close() }
  open()   { this.menuTarget.classList.remove("hidden") }
  close()  { this.menuTarget.classList.add("hidden") }
}

app.register("dropdown", DropdownController);
