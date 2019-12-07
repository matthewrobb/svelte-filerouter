import * as svelte from 'svelte'

const { assign, defineProperties } = Object

const ROUTIFY = 'routify'

export const getContext = svelte.getContext.bind(null, ROUTIFY)
export const setContext = svelte.setContext.bind(null, ROUTIFY)

export function RoutifyContext(context, parent = getContext()) {
  if (!(this instanceof RoutifyContext)) {
    return parent || new RoutifyContext(context, parent)
  }

  // Instance constants
  // Relies on defaults:
  // configurable: false, writable: false, enumerable: false
  defineProperties(this, {
    handlers : { value: [] },
    parent   : { value: parent },
    root     : { value: parent && parent.root || parent || this },
    update   : { value: this.update.bind(this) }
  })

  setContext(assign(this, context))
}

assign(RoutifyContext.prototype, {
  // This enables 'writing to stores'
  // e.g. $context = {} and $context.foo = ''
  set() { 
    assign(this, ...arguments)
    this.update()
  },
  // This enables reading from stores
  // e.g. console.log($context)
  subscribe(fn) {
    if (this.handlers.indexOf(fn) < 0) {
      this.handlers.push(fn)
      
      if (this.parent && this.handlers.length === 1) {
        this.parent.subscribe(this.update)
      } else {
        fn(this) // Fire listeners immediately on subscription
      }
    }
  
    return this.unsubscribe.bind(this, fn)
  },
  unsubscribe(fn) {
    const handlerIndex = this.handlers.indexOf(fn)
  
    if (handlerIndex >= 0) {
      this.handlers.splice(handlerIndex, 1)
    }
  
    if (this.parent && !this.handlers.length) {
      this.parent.unsubscribe(this.update)
    }
  },
  notify(handlers = this.handlers) {
    for (let i = 0, len = handlers.length; i < len; i++) {
      const { [i]: handler } = handlers
      handler(this)
    }
  },
  update() {
    this.notify()
  }
})

export default RoutifyContext
