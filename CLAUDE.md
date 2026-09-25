# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Ateliê Estelar** — a Gacha Club–style character dress-up game in plain HTML/CSS/JS. No dependencies, no build step, no package.json, no tests, no linter. All UI text, comments and identifiers-in-prose are in **Portuguese (pt-BR)**; keep new text in Portuguese.

`referencias/gacha-club/MAPA.md` maps the reference game's screens and actions (extracted from a recording) and is the spec for how screens should behave. `atelie-estelar/` is an old, git-ignored earlier version — do not edit it.

## Running

- Open `index.html` directly in a browser, or serve the folder statically (e.g. `npx serve .` / `python -m http.server`). The service worker only registers over http(s).
- **When publishing a change, bump `CACHE` in `sw.js` and `APP_VERSION` in `js/core/core.js` (shown on the menu tablet) to the same version.** If you add/rename a JS/CSS file, also add it to `ASSETS` in `sw.js` and to the `<script>` list in `index.html`.

## Architecture

**No modules — global scripts with order-dependent loading.** Every file declares top-level globals (`const Store = (() => {...})()`, `const PARTS = {}`, etc.) and later files use earlier ones. The `<script>` order in `index.html` is the dependency order: `core.js` → `rig/parts-*.js` (hair first, it creates `PARTS` and `ol()`) → `data/*` → `rig.js` → `store.js` → `ui/*` → `app.js` (init). Shared helpers (`$`, `$$`, `esc`, `clamp`, `clone`, `uid`, `rng`, `Color`, `Shape`, `Sfx`, `UI`) live in `core/core.js`; small SVG helpers (`ol`, `mir`, `P`, `G` limb geometry) are globals in `parts-*.js` and reused across part files.

**Character data model** (`js/data/defaults.js`):
- `SLOT_DEFS` maps each slot (e.g. `hairBack`, `eyeL`, `sleeveR`, `propL`) to a part catalog `t` in `PARTS`. Left/right slots are linked via `PAIRS`: like Gacha Club, editing the left card (e.g. "Meia") changes both sides and the right card ("Meia direita") changes only the right one. Head/face/neck accessories come in layers (`headAcc3` top · `headAcc`/`headAcc2` middle · `headAcc4` base, etc.) that share one catalog; `logo.p` picks one of the 16 `LOGO_POS` positions.
- A character is `{ name, skin, parts: { [slot]: { i, c: [main, secondary, outline] } }, body, hide, anim, pet, chat, profile, adj, id }`. `parts[slot].i` indexes `PARTS[t]`, where **index 0 = none** (`null`).
- `adj[slot]` = per-part offset/scale/rotation from the "Ajustar" tool, applied around `ANCHORS[slot]`.
- `baseChar()`/`blankParts()`/`look()` build characters; `MAIN_CHARS`, `PRESETS`, `EXPRESSIONS` are defined here too.

**Rendering** (`js/rig/rig.js`): `Rig` builds the whole character as one SVG string from the character object + `POSES[body.pose]` (joint angles). Layer order is documented in the file header. Parts are `{ n, d: k => svgString }` where `k.c` are the slot colors, `k.F` the gradient fill (hair/pupil), `k.S/k.SO` skin/skin-outline. Head/torso parts use character space (viewBox 300×420, head centred at 150,128); limb parts use limb-local space (joint at 0,0, pointing down). `body.turn` switches between 3/4 view and front view. `CROP` in rig.js defines thumbnail viewBoxes per catalog for the editor's item grids.

**State** (`js/core/store.js`): single `Store.s` object persisted to `localStorage` key `atelieEstelar.clube.v2` (debounced `save()`, immediate `saveNow()`, listeners via `Store.on`). Contains 10 main `chars`, 90 `backups`, `studio` scene, 15 `scenes`, settings, player XP/currency. `fixChar()` and `migrate()` repair old/imported data — when adding fields to the character or save shape, add defaults in `baseChar()`/`fresh()` so these fill them in. Character export codes (`AE1:...`) and Gacha Club code import are handled here/in `modals.js`.

**UI** (`js/ui/`): three screens (`#scr-menu`, `#scr-editor`, `#scr-studio`) toggled by `App.show()`; each module re-renders its screen via innerHTML templates. `Editor` is the shell (tabs, undo, zoom); every character edit must go through `Editor.change(fn)` (pushes undo, saves, re-renders). `Panels` (`editor-panels.js`) renders the per-tab panels. `Studio` handles scenes (characters, pets, objects, narrator); `Modals` holds dialogs (tutorial, backups, import/export, options); `ColorPicker` is the shared color editor. Global keyboard handling is in `app.js`.

## Extending

- **New part:** append `{ n: 'Nome', d: k => '<svg…>' }` to the relevant `PARTS.<catalog>` array in `js/rig/parts-*.js` (never insert in the middle — saved characters reference parts by index).
- **New pose:** append to `POSES` in `js/data/poses.js` (shoulder/elbow and hip/knee angles, positive = away from the body; `c` = category). Same append-only rule.
