<script>
  import * as helpers from '../helpers'
  import RoutifyContext from './context.js'
  const route = new RoutifyContext({
    url(path, params) {
      return helpers.url(path, params, route.component, route.root.routes)
    }
  })

  export let layouts = undefined
  export let scopeFromParent = undefined

  let scopeToChild

  $: scoped = { ...scopeFromParent, ...scopeToChild }
  $: [current, ...remainingLayouts] = layouts
  $: $route.component = current
</script>

<svelte:component this={current.component()} let:scoped={scopeToChild} {scoped}>
  {#if remainingLayouts.length}
    <svelte:self
      layouts={remainingLayouts}
      scopeFromParent={{ ...scopeFromParent, ...scopeToChild }} />
  {/if}
</svelte:component>
