import { writable, derived, readable } from 'svelte/store'
import { listen } from './navigator';

export const options = writable({})
export const routes = writable()
export const pages = derived(routes, routes => routes.filter(route => !route.isFallback))
export const fallbacks = derived(routes, routes => routes.filter(route => route.isFallback))

export const pathname = readable(window.location.pathname, set => {
  return listen(()=> {
    const { pathname } = window.location;

    if (pathname !== '/' && /\/$/.test(pathname)) {
      history.replaceState(history.state, '', pathname.replace(/\/$/, ''));
      return;
    }

    set(window.location.pathname);
  });
});

export const route = derived(
  [ pages, fallbacks, pathname ],
  ([ pages, fallbacks, pathname ]) => {
    const urlWithIndex = pathname.match(/\/index\/?$/) ?
        pathname :
        (pathname + "/index").replace(/\/+/g, "/"); //remove duplicate slashes

    let route =
        pages.filter(route => urlWithIndex.match(route.regex))[0]
        || pages.filter(route => pathname.match(route.regex))[0]
        || fallbacks.filter(route => pathname.match(route.regex))[0];

    if (!route) throw new Error(
      `Route could not be found. Make sure ${pathname}.svelte or ${pathname}/index.svelte exists. A restart may be required.`
    )

    const regexUrl = route.regex.match(/\/index$/) ? urlWithIndex : pathname

    const params = route.params = {};

    if (route.paramKeys) {
        regexUrl.match(route.regex).forEach((match, i) => {
            if (i === 0) return;
            const key = route.paramKeys[i - 1];
            params[key] = match;
        });
    }

    return route
  }
);

export const components = derived(route, ({ layouts, component }) => [
  ...layouts, component
]);
