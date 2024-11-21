# BKWay

[![Built with the Deno Standard Library](https://img.shields.io/badge/Built_with_std-blue?logo=deno)](https://jsr.io/@std)

## Further development / roadmap

### Known issues

- [ ] When a stop A can be reached via walking from stop B, or transit from stop C, and C is not a parent of B, and reaching B from the root is faster, than reaching C from the root, but reaching A from the root is faster via C, A's parent will be incorrectly set as B
  - However, this behaviour could be seen as desirable/intentional when using BFS
- [ ] Tailwind should be eliminated
- [ ] All theming and most CSS should be moved to MUI style config
- [ ] Changing the heuristic weight can be bothersome, since it doesn't allow 0 values (not even temporarily)
- [ ] Code could be cleaned up
  - [ ] `flyTo` should be in a util file (also, take a look at Mapbox GL JS's [built-in `flyTo`](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto))
- [ ] Start stop doesn't show on final plan

### Potential improvements

- [ ] Brief explanations of algorithms in tooltips
- [ ] Heuristics unit should be denoted with an *m* after the number
- [ ] GitHub repo should be linked somewhere on the page
- [ ] On the pathfinding tab, there should be buttons to fly to selected stops
  - [ ] Also consider adding a highlight to last updated stop
- [ ] Load environment variables from .env on backend
- [ ] Improvements to data handling
  - [ ] Load database to memory (by setting its location to `:memory:`)
  - [ ] Use relative paths for GeoJSON files
  - [ ] Use *.env* variables for data location (including database and GeoJSON files)
  - [ ] Create joined table (possibly view?) for joined stops -> routes for searching stops
  - [ ] Allow for refreshing the source data with no downtime
- [ ] Don't reload `incompletePaths` on every step, append/remove old paths instead
  - Since paths to `parentVertex` are cached, this might not even be a significant performance improvement. Low priority
- [ ] Accessible mode: filter stops and routes to only those accessible with a wheelchair
- [ ] Clickable stops for setting source and target
- [ ] Use [WAMP](https://wamp-proto.org/) for request-response-based WebSocket communication
  - Skips sending headers on every request
- [ ] Unused columns (especially those always null) should be omitted from responses
- [ ] Light mode?
- [ ] Use better alternatives for:
  - [ ] Package manager: [pnpm](https://github.com/pnpm/pnpm) or [Deno](https://github.com/denoland/deno)
  - [ ] Backend bundler: [esbuild](https://github.com/evanw/esbuild)
  - [ ] Backend runtime: [txiki.js](https://github.com/saghul/txiki.js/) (Can be compiled to a standalone executable using `tjs compile`)
- [ ] Polyfill for 97%-ish browser support with [Babel](https://github.com/babel/babel)
- [ ] i18n
- [ ] Support different GTFS sources other than Budapest
  - Possibly using a tenant model on the backend?

## Thanks

- To @blinktaginc for [node-gtfs](https://github.com/blinktaginc/node-gtfs)
- To @mcserep for [elteikthesis](https://github.com/mcserep/elteikthesis)
