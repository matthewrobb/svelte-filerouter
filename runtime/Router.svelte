<script>
  import * as stores from './store'
  import RoutifyContext from "./context.js"
  import { matchRoute } from '../helpers.js'
  import Route from "./Route.svelte"
  
  export const router = new RoutifyContext({ component: 'Root' })
  export let pathname = window.location.pathname
  export let routes

  let match, route, layouts

  $: match   = matchRoute(routes, pathname)
  $: if (match) route   = { ...match.route, params: match.params }
  $: if (route) layouts = [ ...route.layouts, route ]
  $: $router = { route, layouts, routes }

  $: stores.route.set(route)

  function handleHistory() {
    pathname = window.location.pathname
  }
</script>
{#if routes && route && layouts}
  <Route {layouts} />
{/if}

<svelte:window
  on:click={handleClick}
  on:popstate={handleHistory}
  on:pushstate={handleHistory}
  on:replacestate={handleHistory}
/>

<script context="module">
  function handleClick(event) {
    const el = event.target.closest('a')
    const href = el && el.getAttribute('href')

    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return
    if (!href || el.target || el.host !== location.host) return

    event.preventDefault()
    history.pushState({}, '', href)
  }

  // create events for pushState and replaceState
  ['pushState', 'replaceState'].forEach(eventName => {
      const fn = history[eventName]
      history[eventName] = function (state, title, url) {
          const event = Object.assign(new Event(eventName.toLowerCase(), { state, title, url }))
          Object.assign(event, { state, title, url })

          fn.apply(this, [state, title, url])
          return dispatchEvent(event)
      }
  })
</script>