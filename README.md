# La cueva Wumpus

A client-only, Spanish-language Angular game of exploration and deduction. Configure an orthogonal square cave, follow the clues, collect the gold, and return to the entrance. Each randomly generated layout includes a safe route to the gold.

## Prerequisites

- Node.js 20.19+ (or the Node version supported by Angular CLI 22)
- npm 10+
- Chrome or Chromium to run the Karma browser tests

## Install and run

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app runs entirely in the browser; no account, backend, or saved data is required.

## Play

Choose a board size of at least 2, a pit count from 0 to `size² - 3`, and a non-negative number of arrows. You begin in the upper-left corner facing down. Turn in 90-degree increments, move one cell at a time, and use perceptions to avoid hazards. Hitting a wall keeps you in place. A shot travels in a straight line to the board edge. Collect the gold, return to the start, and use **Salir** to win. The map does not reveal unexplored hazards; after the game ends, it displays the complete layout.

## Test and build

Run the Karma/Jasmine unit tests in Chrome Headless:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

For local development with automatic rebuilds, run `npm run watch`.

## Project structure

- `src/app/game-engine.ts` — typed rules, random safe layout generation, perceptions, and state transitions.
- `src/app/*` — standalone Angular setup, map, controls, status, and log components.
- `src/app/*.spec.ts` — unit and UI tests executed by Karma/Jasmine.
