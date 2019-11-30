import { get } from 'svelte/store'
import * as store from './store'

export const url = (path, params) => {
    const routes = get(store.routes)
    const route = get(store.route)

    if (path.match(/^\.\.?\//)) {
        //RELATIVE PATH
        // strip component from existing route
        let url = route.url.replace(/[^\/]+$/, '')

        // traverse through parents if needed
        const traverse = path.match(/\.\.\//g)
        if (traverse)
            for (let i = 1; i <= traverse.length; i++) {
                url = url.replace(/[^\/]+\/$/, '')
            }

        // strip leading periods and slashes
        path = path.replace(/^[\.\/]+/, '')
        path = url + path
    } else if (path.match(/^\//)) {
        // ABSOLUTE PATH
    } else {
        // NAMED PATH
        let newPath = routes.filter(r => r.name === path)[0]
        if (!newPath) console.error(`a path named '${path}' does not exist`)
        else
            path = newPath.url.replace(/\/index$/, '')
    }

    params = Object.assign({}, route.params, params)
    for (let [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value)
    }
    return path
}
