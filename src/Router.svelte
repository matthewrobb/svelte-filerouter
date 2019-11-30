<script>
  import {url} from './utils'
  import { suppressWarnings } from "./scripts.js";
  import Route from "./Route.svelte";
  import { options, routes, route, components } from './store';

  export let scoped

  $: if (!$options.unknownPropWarnings) {
    suppressWarnings([ 'scoped' ]);
  }
</script>

<Route routes={$routes} route={$route} components={$components} rootScope={scoped} {url} />
