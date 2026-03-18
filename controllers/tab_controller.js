
const { Application, Controller } = Stimulus;
const app = Application.start();

class TabsController extends Controller {
  static targets = ["tab","panel"]

  connect() { this.idx = 0; this.render() }

  switch(e) {
    this.idx = this.tabTargets.indexOf(e.currentTarget)
    this.render()
  }

  render() {
    this.tabTargets.forEach((t, i) => {
      const a = i === this.idx
      t.classList.toggle("border-indigo-600", a)
      t.classList.toggle("text-indigo-600",   a)
      t.classList.toggle("font-semibold",     a)
      t.classList.toggle("bg-white",          a)
      t.classList.toggle("border-transparent",!a)
      t.classList.toggle("text-gray-500",     !a)
      t.classList.toggle("font-medium",       !a)
    })
    this.panelTargets.forEach((p, i) => p.classList.toggle("hidden", i !== this.idx))
  }
}

app.register("tabs", TabsController);