const { Application, Controller } = Stimulus;
const app = Application.start();

class ToastController extends Controller {
  static targets = ["container"]

  show({ params: { type = "info", msg = "Notification" } }) {
    const map = {
      info:    { ring:"bg-blue-50 border-blue-200 text-blue-800",       dot:"bg-blue-500"    },
      success: { ring:"bg-emerald-50 border-emerald-200 text-emerald-800", dot:"bg-emerald-500" },
      warning: { ring:"bg-amber-50 border-amber-200 text-amber-800",    dot:"bg-amber-500"   },
      danger:  { ring:"bg-red-50 border-red-200 text-red-800",          dot:"bg-red-500"     },
    }
    const cfg = map[type] ?? map.info
    const el  = document.createElement("div")
    el.className = `flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm shadow-lg ${cfg.ring} transition-all duration-300 opacity-0 translate-y-2`
    el.innerHTML = `<span class="w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}"></span><span class="flex-1">${msg}</span><button class="text-lg leading-none opacity-40 hover:opacity-80 ml-1 cursor-pointer">✕</button>`
    el.querySelector("button").onclick = () => this._dismiss(el)
    this.containerTarget.appendChild(el)
    requestAnimationFrame(() => {
      el.classList.replace("opacity-0","opacity-100")
      el.classList.replace("translate-y-2","translate-y-0")
    })
    setTimeout(() => this._dismiss(el), 4000)
  }

  _dismiss(el) {
    el.classList.replace("opacity-100","opacity-0")
    el.classList.add("-translate-y-1")
    setTimeout(() => el.remove(), 300)
  }
}

app.register("toast", ToastController);
