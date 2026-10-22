# Hunt the Wumpus - Project Plan

## Goal and scope

- Build a Spanish-language, client-side Angular single-page game.
- Do not add a backend, sign-in, or persistence.
- Provide a configuration screen and a separate gameplay screen, supporting a complete game through win or loss.
- Keep controls simple and add a grid map. Hide hazard locations until the player discovers relevant information.

## Game rules and setup

- Use an orthogonal `n x n` grid. The hunter starts in the upper-left cell facing down. Turning changes direction by 90 degrees; forward movement follows the current facing.
- Randomly place the gold, one stationary Wumpus, and the configured number of pits in distinct cells, never on the start.
- Regenerate layouts until there is a safe route to the gold that avoids pits and the live Wumpus.
- Accept integer board sizes `n >= 2`, pit counts from `0` through `n^2 - 3`, and arrow counts `>= 0`. Do not impose an arbitrary fixed upper bound.
- Suggested initial configuration values: a `5 x 5` board, 2 pits, and 5 arrows.
- Entering a pit or the live Wumpus ends the game in a loss. Moving forward beyond the grid keeps the hunter in place and reports a bump.
- Report perceptions for the room the hunter occupies, following the assignment: stench adjacent to the live Wumpus, breeze adjacent to a pit, glitter on the gold, and a scream when an arrow kills the Wumpus.
- Entering the gold cell collects it automatically.
- Shooting sends an arrow straight ahead to the board edge. A live Wumpus in its path is killed; one arrow is spent per shot, and the log reports a hit or miss. Shooting is unavailable when no arrows remain.
- The exit action works only at the start. Without the gold, it is blocked with a message; with the gold, it ends the game in a win.
- Track and display the number of gameplay actions as the efficiency measure.

## User interface

- **Configuration screen:** inputs for grid size, pit count, and arrows; validation; and a start-game button.
- **Gameplay screen:** a grid map showing the hunter, start, and visited or known cells without exposing undiscovered hazards; controls for forward, left, right, shoot, and exit; and a Spanish text log for perceptions and outcomes.
- Show facing direction, gold status, arrows remaining, and action count.
- At game end, clearly show win or loss and provide a way to start a fresh game.

## Implementation outline

- Keep game rules and state transitions in a focused TypeScript game model/engine, separate from Angular presentation.
- Use Angular standalone components for setup, gameplay/map, controls, and the perception/status display, following the existing app structure and SCSS styling.
- Make the random source controllable in tests so layout generation can be tested deterministically.

## Testing and documentation

- Match the assignment's Karma requirement by configuring Karma/Jasmine in place of the project's current Vitest setup, after verifying the Angular version supports the required setup.
- Add unit tests for configuration validation, random layout constraints and safe-route generation, movement and turning, wall bumps, perceptions, arrow hit/miss/exhaustion, gold collection, exit rules, and win/loss state. Test relevant UI behavior as well.
- Update the README with prerequisites and commands to install, run, and test the app.

## Milestones

1. Confirm the rules and configuration model; implement deterministic random layout generation.
2. Implement the Angular configuration and gameplay/map screens.
3. Connect controls, perceptions, game-ending rules, and the action counter.
4. Add Karma/Jasmine tests and README instructions; run tests and a production build.
