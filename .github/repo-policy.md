# Product Guardrails
- Simplicity over features — this is a single-purpose menu bar utility, not a platform
- Lightweight footprint — the app must stay under 5 MB; avoid adding heavy dependencies
- Cross-platform parity — macOS and Windows builds must stay in sync
- No network access — ZoneBar is offline-only; reject anything that phones home or adds telemetry
- Native feel — the app should behave like a system utility, not a web app (fast popover, tray integration, focus-loss dismiss)

# Risk Classification
## Always High Risk
- Changes to `src-tauri/src/lib.rs` tray icon setup, window management, or Tauri plugin initialization
- Changes to `.github/workflows/release.yml` or `.github/workflows/release-runner.yml` (release pipeline)
- Changes to `src-tauri/Cargo.toml` dependency list (Rust supply chain)
- Modifications to code signing, notarization, or certificate handling in CI
- Changes to Tauri capabilities (`src-tauri/capabilities/default.json`) — these control OS-level permissions
- Any change that adds network permissions or new Tauri plugins

## Always Low Risk
- Documentation-only changes (README.md, comments)
- Additions or corrections to `src/data/timezones.ts` (adding cities, fixing labels/aliases/flags)
- Icon or screenshot asset updates in `assets/` or `src-tauri/icons/`
- Changes to `.vscode/` configuration

# Decision Rules
## Bugs
- Fix if reproducible or obvious from code inspection
- Timezone calculation bugs are high priority — wrong times erode all trust in the app
- Window positioning or popover visibility bugs are medium priority
- Close as duplicate if an existing issue covers it
- If a bug only affects one platform, label it with the platform name in the title

## Features
- Accept if it improves the core use case: quickly comparing times across zones
- Decline if it adds UI complexity that slows down the one-click-to-see-times flow
- Decline requests for online features (sync, sharing, calendar integration) — the app is offline by design
- Escalate to human if the feature requires new Tauri plugins or OS permissions
- New timezone entries in `timezones.ts` can be accepted without escalation

## External PRs
- The idea matters, the exact code doesn't — OK to reimplement rather than iterate on the PR
- External PRs that touch Rust code (`src-tauri/`) require extra scrutiny; escalate to human
- External PRs that only touch `src/` TypeScript/React code can be reviewed autonomously if risk is low

# Repo-Specific Rules
- **Protected modules**: Treat any change to `src-tauri/src/lib.rs` `run()` function (Tauri setup, tray builder, window event handlers) as `risk:high`
- **Preferences persistence**: The `read_preferences` / `write_preferences` commands in `lib.rs` store user data to disk; changes here must preserve backward compatibility with existing `preferences.json` files
- **Merge strategy**: Squash merge (configured in `repo-policy.yml`)
- **Timezone data format**: Entries in `src/data/timezones.ts` must follow the `TimezoneEntry` interface — `id` must be a valid IANA timezone identifier, `label` a short friendly name, `flag` a single flag emoji, and `aliases` an array of search terms
- **Build requirements**: The project requires Rust and Node.js 22+; CI uses `npm ci` — do not switch to yarn or pnpm
- **No new Tauri plugins** without human approval — each plugin expands the OS permission surface
- **Tray icon**: `src-tauri/icons/tray-icon.png` is used as a template image on macOS; replacements must be single-color with transparency to render correctly in both light and dark menu bars
- **Version bumping**: Version lives in both `package.json` and `src-tauri/Cargo.toml`; PRs that change the version in only one place should be flagged