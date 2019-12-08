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

  let scopeToChild, scoped, current, remainingLayouts

  $: scoped = { ...scopeFromParent, ...scopeToChild }
  $: if (layouts) [current, ...remainingLayouts] = layouts
  $: $route.component = current

  $: console.log(route);
</script>

{#if current}
  <svelte:component this={current.component()} let:scoped={scopeToChild} {scoped} route={$route.root.route}>
    {#if remainingLayouts.length}
      <svelte:self
        layouts={remainingLayouts}
        scopeFromParent={{ ...scopeFromParent, ...scopeToChild }} />
    {/if}
  </svelte:component>
{/if}
