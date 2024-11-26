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
- [ ] Loading spinner in search bar doesn't show unless there had already been results before changing the query
- [ ] Accented letters are case-sensitive when searching for stops
- [ ] Certain trips stop times are above 24:00; pathfinding ignores those starting from 00:00-24:00 when exploring thesse

### Potential improvements

- [ ] Brief explanations of algorithms in tooltips
- [ ] Heuristics unit should be denoted with an *m* after the number
- [ ] GitHub repo should be linked somewhere on the page
- [ ] When both source and target stops have been selected, the map should zoom to a position where both are in view
- [ ] On the pathfinding tab, there should be buttons to fly to selected stops
  - [ ] Also consider adding a highlight to last updated stop
- [ ] Maximum transfer time is currently hardcoded to 1 hour, this should be on option
- [ ] Option to limit total walking distance
- [ ] Option to optimize for travel distance in meters (for Dijkstra's and A*)
- [ ] Load environment variables from .env on backend
- [ ] Improvements to data handling
  - [ ] Load database to memory (by setting its location to `:memory:`)
  - [ ] Use relative paths for GeoJSON files
  - [ ] Use *.env* variables for data location (including database and GeoJSON files)
  - [ ] Create joined table (possibly view?) for joined stops -> routes for searching stops
  - [ ] Allow for refreshing the source data with no downtime
- [ ] Use implementation of PriorityQueue where removing an arbitrary item is possible to allow for changing `parentEdge` if we find a faster route
- [ ] Don't reload `incompletePaths` on every step, append/remove old paths instead
  - Since paths to `parentVertex` are cached, this might not even be a significant performance improvement. Low priority
- [ ] Accessible planning mode: filter stops and routes to only those accessible with a wheelchair
- [ ] Better accessibility, a11y support
- [ ] Clickable stops for setting source and target
- [ ] Use [WAMP](https://wamp-proto.org/) for request-response-based WebSocket communication
  - Skips sending headers on every request
- [ ] Unused columns (especially those always null) should be omitted from responses
- [ ] More information about the algorithm's current status
  - [ ] Display total travel distance in meters
  - [ ] List of already visited nodes
  - [ ] List of possible inEdges for each node
  - [ ] View queue/heap even after the algorithm has found a route
- [ ] Searching for multiple routes
  - [ ] Multiple routes with the same algorithm (eg. top 3)
  - [ ] Running multiple algorithms at once
- [ ] History/stepping backwards
- [ ] Light mode?
- [ ] Use better alternatives for:
  - [ ] Package manager: [pnpm](https://github.com/pnpm/pnpm) or [Deno](https://github.com/denoland/deno)
    - Deno would require Deno >= 2.0, as node-gtfs curently [isn't compatible](https://github.com/BlinkTagInc/node-gtfs/issues/157) with Deno 1.x
  - [ ] Backend bundler: [esbuild](https://github.com/evanw/esbuild)
  - [ ] Backend runtime: [txiki.js](https://github.com/saghul/txiki.js/) (Can be compiled to a standalone executable using `tjs compile`)
- [ ] Polyfill for 97%-ish browser support with [Babel](https://github.com/babel/babel)
- [ ] i18n
- [ ] Two-way pathfinding (the same algorithm running from the end stop in reverse, in parallel with the regular one)
- [ ] Support different GTFS sources other than Budapest
  - Possibly using a tenant model on the backend?

## Thanks

- To @blinktaginc for [node-gtfs](https://github.com/blinktaginc/node-gtfs)
- To @mcserep for [elteikthesis](https://github.com/mcserep/elteikthesis)
