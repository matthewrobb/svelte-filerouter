# svelte-filerouter

###### Minimalist SPA file router inspired by [Sapper router.](https://sapper.svelte.dev/docs#File_naming_rules)

While svelte-filerouter and Sapper's router should work interchangeably, there are some key differences.

|Differences|Sapper router|svelte-filerouter|
| - | -------------- | ------------- |
|SSR   | +           | -             |
|SPA   | -           | +             |
|Resets| -           | +             |
|Scoped variables| - | +             |
|Route props | - | + |
|Helpers | - | + |
|Fast dev builds| - | + |


# To install

``npm i -D svelte-filerouter``


```html
<!--App.svelte-->

<script>
    import { Router } from "svelte-filerouter";
</script>

<Router />

```

```javascript
// rollup.config.js
import { fileRouter } from 'svelte-filerouter'
...
    plugins: [
        fileRouter({}),
...

```
fileRouter accepters the following parameters:

``appFile: path/to/App.svelte`` (Defaults to ./src/App.svelte)

``pages: path/to/pages`` (Defaults to ./src/pages)

``ignore: ['widget.svelte']`` (Files and dirs. Can be string or array. Interpreted as regular expression)

``unknownPropWarnings: true`` (Defaults to true. Disable to hide warnings about props passed by filerouter)

``dynamicImports: false`` (Experimental code splitting. Defaults to false.)


# **Guide**

### File scheme

##### Basic
``src/pages/about.svelte`` corresponds to ``/about``

##### Parameters
``src/pages/admin/[business].svelte`` corresponds to ``/admin/:business``

##### To exclude
``src/admin/_navbar.svelte`` corresponds to nothing as _prefixed files are ignored.

##### Layouts
Layout files are named ``_layout.svelte`` and apply to all adjacent and nested svelte files. A file can have multiple layouts if multiple layouts are recursively present in parent folders.

#### Resets
Reset files are named ``_reset.svelte``. They function exactly like layout files, but do no inherit parent layouts.

##### 404 and fallbacks
404s can be caught with _fallback.svelte. The first _fallback.svelte that's found while traversing back through parent folders will be used.

### Accessing route and parameters
Examples below is reactive

```html
<!-- src/pages/admin/[business]/[project].svelte-->
<script>
    export let route //current route
    export let routes //all routes
</script>

<a href="my/path">go somewhere</a>

<div>Business: {route.params.business}</div>
<div>Project: {route.params.project}</div>
```

route(s) can also be accessed like this
``import { route, routes } from "svelte-filerouter"``
(``route`` is reactive)

### Props
Props can be passed through the ``scopes`` prop.
```html
<!-- src/pages/posts/_layout.svelte -->
<script>
    import posts from posts.js
    export let route;
    $: { postId } = route.params;
    $: post = posts[postId]
</script>
<slot scoped={{post}} />
```
Props passed through ``scopes`` are available to all nested components served by the router. Props can be accessed directly or through the ``scoped`` prop.
```html
<!-- src/pages/posts/[postId]/index.svelte -->
<script>
    export let post
</script>
<h1>{post.title}</h1>
<div>{post.body}</div>
```

### Helpers
#### url ( path, params )
Can be imported with ``export let url``.

**path**:string -
An absolute, relative or named path. Parameters are prefixed with colon. Absolute paths starts with ``/``. Relative paths starts with ``./`` or ``../``. Paths that aren't prefixed we be considered named paths. A route is named by it's parent dir and filename (without extension). E.g. the file ``src/pages/companies/[companyId]/index.svelte`` will have the name ``companyId/index``

**params**:object - 
Parameters. If parameters already exist within the current route, these are merged. Therefore, parameters included in the current route, do not need to be specified again.

Examples
 ```html
<!-- src/pages/companies/[companyId]/index.svelte -->
<script>
  export let url
</script>

<!-- absolute routes -->
<a href={url('/')}>Frontpage</a>
<a href={url('/companies/')}>Company index</a>
<a href={url('/companies/:companyId')}>Current company/page</a>
<a href={url('/companies/:companyId/products')}>Products</a>
<a href={url('/companies/:companyId/products/:productId'), {productId: 123}}>Product no. 123</a>
<a href={url('/companies/:companyId'), {companyId: 456}}>Different company</a>

<!-- relative routes -->
<a href={url('../../')}>Frontpage</a>
<a href={url('../')}>Company index</a>
<a href={url('./')}>Current company/page</a>
<a href={url('./products')}>Products</a>
<a href={url('./products/:productId', {productId: 123})}>Product no. 123</a>
<a href={url('./', {companyId: 123})}>Different company</a>

<!-- named routes -->
<a href={url('/index')}>Frontpage</a>
<a href={url('company/index')}>Company index</a>
<a href={url('companyId/index')}>Current company/page</a>
<a href={url('products/index')}>Products</a>
<a href={url('productId/index') , {productId: 123}}>Product no. 123</a>
<a href={url('companyId/index'), {companyId: 123}}>Different company</a>
```




# Examples
https://github.com/jakobrosenberg/svelte-filerouter-example

# Notes
- ``<a href="my/path">`` tags are handled by svelte-router

# Roadmap
- ``<link path="pathname" params={params}>`` or similar for normalized link handling. As well as helper script to generate url from pathname and parameters.
- Example project

# Caveats
Restart of Rollup is required to update the routes map.
This is fixed in v1.4.0 - To try it run ``npm i svelte-filerouter@beta`` (yes, @next wold have made more sense)

## Issues
Feel free to open an issue or a pull request, if there's anything you think could be improved.
