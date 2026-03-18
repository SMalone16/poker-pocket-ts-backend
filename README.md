![poker_pocket_promo](./poker_pocket.png)

# Poker Pocket Typescript Backend

Nitramite Poker Pocket back end server was developed to run poker games. It's powering
[Nitramite Poker Pocket game](https://pokerpocket.nitramite.com/). This back end is pretty lightweight
and can run thousands of rooms easily.

This ts version replaces old js version https://github.com/norkator/poker-pocket-backend.

## Repository layout

- `src/` contains the existing TypeScript backend and websocket game server.
- `web/` contains a new React + Vite browser client with routes for `/`, `/lobby`, `/room/:roomCode`, and `/profile`.
- In development, the Vite dev server proxies `/ws` to the backend on port `8000` so the browser can always connect through the same public origin.
- In production-style local builds, `npm run build` compiles both the backend and `web/dist`, and the backend serves the built SPA while exposing the websocket endpoint at `/ws`.

### Testing it out

Current staging: https://pokerpocket-staging.nitramite.com  
Current production: https://pokerpocket.nitramite.com

Android client (production): https://play.google.com/store/apps/details?id=com.nitramite.pokerpocket

Get following front end client:

* React Web UI: https://pokerpocket-staging.nitramite.com
    * React Web UI source code: https://github.com/norkator/poker-pocket-react-client

### Prerequisites

* Download handRanks.dat file
  from: [https://github.com/christophschmalhofer/poker/blob/master/XPokerEval/XPokerEval.TwoPlusTwo/HandRanks.dat](https://github.com/christophschmalhofer/poker/blob/master/XPokerEval/XPokerEval.TwoPlusTwo/HandRanks.dat)  
  and place it under `/src` folder.

### Basic setup

1. Create database named `poker-pocket-ts` or define your own db name by setting env var `DB_NAME`
2. Add new schema into database called `poker`
3. Define and fill rest of env vars
    ```
    DB_HOST=<value>
    DB_USER=<value>
    DB_PASS=<value>
    DB_NAME=<value, by default poker-pocket-ts>
    ```
4. Define secrets
    * Define env var `PW_SECRET=<value>` and get value using `npm run secret`
    * Define env var `PW_REFRESH_SECRET=<value>` and get value using `npm run secret`
5. Run `npm install`
6. Run `npm run dev` for the combined backend + web workflow, or use `npm run dev:server` and `npm run dev:web` separately.
7. Open `http://localhost:5173` for the Vite client or `http://localhost:8000` after running `npm run build && npm run start`.
8. Browser websocket connections are derived from `window.location`, so the frontend automatically uses `ws://<current-host>/ws` or `wss://<current-host>/ws`.

## Single sendable GitHub Codespaces URL flow

This repository now supports a one-link browser workflow in Codespaces:

1. Start both processes inside the Codespace:
   ```bash
   npm install
   npm run dev
   ```
2. In the **Ports** panel, make port `5173` public (or private if you only need your own access).
3. Open the forwarded `5173` URL. That single URL serves the React app.
4. The React app computes its websocket URL from `window.location` and connects to `/ws` on the same origin.
5. Vite proxies `/ws` back to the backend process running internally on port `8000`, so you do **not** need to separately share port `8000`.

Example flow:

- Shared URL: `https://<codespace-name>-5173.app.github.dev`
- Browser page load: `https://<codespace-name>-5173.app.github.dev/lobby`
- Browser websocket target: `wss://<codespace-name>-5173.app.github.dev/ws`
- Vite proxy target inside the Codespace: `ws://127.0.0.1:8000`

## Web client notes

- The browser app lives in `web/` and uses React Router for `/`, `/lobby`, `/room/:roomCode`, and `/profile`.
- The Vite dev server is configured to proxy websocket traffic from `/ws` to `ws://127.0.0.1:8000`.
- The backend can also serve `web/dist` directly, with SPA fallback routing and websocket upgrades handled on `/ws`.

### AI LLM Addon

* https://github.com/norkator/poker-pocket-ai-provider

### Note

`.gitignore` file is set to ignore `HandRanks.dat` which is big file.

## Authors

* **Martin Kankaanranta** - *Initial work* - [norkator](https://github.com/norkator)

## Contributors

None for ts version.

For old js version which this repository is based:

### [shrpne](https://github.com/shrpne)

* [Commits](https://github.com/norkator/poker-pocket-backend/commits?author=shrpne)

### [linus2code](https://github.com/linus2code)

* [Commits](https://github.com/norkator/poker-pocket-backend/commits?author=linus2code)
* Created [React version](https://github.com/linus2code/poker-pocket-react-client) of Web UI

## License

MIT
