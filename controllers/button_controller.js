const { Application, Controller } = Stimulus;
const app = Application.start();

class ButtonController extends Controller {
  static values = {
    variant:     { type: String,  default: "default"    },
    size:        { type: String,  default: "default"    },
    loading:     { type: Boolean, default: false        },
    loadingText: { type: String,  default: "Loading..." },
    clickable:   { type: Boolean, default: false        },
  }

  connect() {
    this._originalHTML = this.element.innerHTML
    this.applyBase()
    this.applyVariant()
    this.applySize()
    this.applyLoading()
    if (this.clickableValue) {
      this.element.addEventListener("click", () => this.handleClick())
    }
  }

  applyBase() {
    this.element.classList.add(
      "inline-flex","items-center","justify-center","gap-2",
      "whitespace-nowrap","rounded-md","text-sm","font-medium",
      "transition-all","cursor-pointer","focus:outline-none",
      "focus:ring-2","focus:ring-offset-2",
      "disabled:pointer-events-none","disabled:opacity-50"
    )
  }

  applyVariant() {
    const map = {
      default:     ["bg-black","text-white","hover:bg-neutral-800","focus:ring-black"],
      destructive: ["bg-red-600","text-white","hover:bg-red-700","focus:ring-red-500"],
      outline:     ["border","border-gray-300","bg-white","text-gray-800","hover:bg-gray-100","focus:ring-gray-300"],
      secondary:   ["bg-gray-200","text-gray-900","hover:bg-gray-300","focus:ring-gray-300"],
      ghost:       ["text-gray-700","hover:bg-gray-100","focus:ring-gray-200"],
      link:        ["text-blue-600","underline-offset-4","hover:underline","focus:ring-blue-400"],
      success:     ["bg-emerald-600","text-white","hover:bg-emerald-700","focus:ring-emerald-500"],
      warning:     ["bg-amber-500","text-white","hover:bg-amber-600","focus:ring-amber-400"],
    }
    this.element.classList.add(...(map[this.variantValue] ?? map.default))
  }

  applySize() {
    const map = {
      xs:      ["h-7","px-2.5","text-xs","rounded"],
      sm:      ["h-8","px-3","text-xs"],
      default: ["h-9","px-4","py-2"],
      lg:      ["h-11","px-6","text-base"],
      xl:      ["h-12","px-8","text-lg","rounded-xl"],
      icon:    ["h-9","w-9","p-0"],
    }
    this.element.classList.add(...(map[this.sizeValue] ?? map.default))
  }

  applyLoading() {
    if (!this.loadingValue) return
    this.setLoading(true)
  }

  setLoading(on) {
    if (on) {
      this.element.disabled = true
      this.element.innerHTML = `
        <svg class="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
          <path d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" fill="currentColor" class="opacity-75"/>
        </svg>
        ${this.loadingTextValue}
      `
    } else {
      this.element.disabled = false
      this.element.innerHTML = this._originalHTML
    }
  }

  handleClick() {
    if (this.element.disabled) return
    this.setLoading(true)
    setTimeout(() => this.setLoading(false), 2000)
  }
}

app.register("button", ButtonController);