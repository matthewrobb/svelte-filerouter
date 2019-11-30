// create events for pushState and replaceState
['pushState', 'replaceState'].forEach(eventName => {
    const fn = history[eventName]
    history[eventName] = function(state, title, url) {
        const event = Object.assign(new Event(eventName.toLowerCase(), { state, title, url }))
        Object.assign(event, { state, title, url })

        fn.apply(this, [state, title, url])
        return dispatchEvent(event)
    }
})

export function listen(fn) {
  addEventListener('popstate', fn);
  addEventListener('replacestate', fn);
  addEventListener('pushstate', fn);
  addEventListener('click', handleClick);

  function handleClick(event) {
    const el = event.target.closest('a')
    const href = el && el.getAttribute('href')

    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return;
    if (!href || el.target || el.host !== location.host) return;

    event.preventDefault();
    history.pushState({}, '', href)
  }

  fn();

  return ()=> {
    removeEventListener('popstate', fn);
    removeEventListener('replacestate', fn);
    removeEventListener('pushstate', fn);
    removeEventListener('click', handleClick);
  };
}
