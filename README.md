# opencode-custom-logo

**OpenCode TUI plugin — your own ASCII art logo on the home screen.**

Drop your ASCII art in a JSON config file and it shows up every time you open OpenCode. Works with any theme, adapts to terminal size.

---

## Install

Add the plugin to your OpenCode TUI config:

```json
// ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-custom-logo"]
}
```

Restart OpenCode. The default OpenCode banner appears.

---

## Configure your logo

Create `~/.config/opencode/custom-logo.json`:

```json
{
  "art": [
    "  ╔═══╗ ╔══╗ ╔══╗  ╔═══╗",
    "  ║   ║ ║  ║ ║  ║  ║   ║",
    "  ║   ║ ║  ║ ║  ║  ║   ║",
    "  ╚═══╝ ╚══╝ ╚══╝  ╚═══╝"
  ],
  "compact": "⚡ My Tool",
  "color": "cyan"
}
```

Restart OpenCode. Done.

---

## Config reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `art` | `string[]` | OpenCode banner | ASCII art lines — one string per row |
| `compact` | `string` | `"✦ OpenCode ✦"` | Fallback text for small terminals |
| `color` | `string` | `"accent"` | `"accent"` = theme accent, or any color name (`"cyan"`, `"magenta"`, `"#ff69b4"`) |
| `order` | `number` | `200` | Slot priority — higher beats Gentle AI's logo (100) |
| `minWidth` | `number` | `64` | Minimum columns to show full art (falls back to `compact`) |
| `minHeightExtra` | `number` | `6` | Extra rows beyond art length required (for UI chrome) |

---

## How it works

1. **Plugin loads** → reads `custom-logo.json` once at startup
2. **Terminal check** → if terminal ≥ `minWidth` cols and ≥ `art.length + minHeightExtra` rows → renders the full art
3. **Small terminal** → renders the `compact` string instead
4. **No config file** → falls back to the default OpenCode banner

---

## Compose with other logo plugins

Multiple logo plugins can coexist. The one with the highest `order` wins.

```json
// custom-logo.json
{ "order": 300 }
```

Gentle AI's `gentle-logo` uses `order: 100`, this plugin defaults to `200`. Crank it up if something else is competing.

---

## Remove Gentle AI's logo

If Gentle AI installed its own logo and you want only yours, remove it from `tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    "opencode-subagent-statusline",
    "opencode-sdd-engram-manage",
    "opencode-custom-logo"
  ]
}
```

(Notice `gentle-logo.tsx` path is gone.)

---

## ASCII art generators

- [patorjk.com](https://patorjk.com/software/taag/) — FIGlet fonts
- [asciiart.eu](https://www.asciiart.eu/) — curated collections
- [textkool.com](https://textkool.com/en/ascii-art-generator) — simple text → ASCII

---

## Local development

```bash
pnpm install --ignore-scripts
pnpm build

# Test locally — point OpenCode at the built file
# ~/.config/opencode/tui.json
# { "plugin": ["/absolute/path/to/opencode-custom-logo/dist/tui.js"] }
```

---

## License

MIT
