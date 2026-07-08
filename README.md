# opencode-custom-logo

**OpenCode TUI plugin — your own ASCII art logo on the home screen.**

Drop your ASCII art in a JSON config file and it shows up every time you open OpenCode. Works with any theme, adapts to terminal size. No code editing required.

---

## What is `tui.json`?

OpenCode has **two plugin systems**, both official:

| File | Type | What it loads |
|------|------|---------------|
| `~/.config/opencode/tui.json` | **UI plugins** | Logos, sidebars, panels, visual widgets |
| `~/.config/opencode/opencode.json` → `"plugin"` | **Infrastructure plugins** | Auth providers, integrations |

`tui.json` is **not** a Gentle AI invention — it's OpenCode's own mechanism. The schema URL confirms it: `"$schema": "https://opencode.ai/tui.json"`. Gentle AI just creates the file for you during install. If you've never used Gentle AI, you can create `tui.json` yourself and it works exactly the same.

---

## Install

### With Gentle AI (tui.json already exists)

Add `"opencode-custom-logo"` to your existing `tui.json` plugin array:

```jsonc
// ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    "opencode-subagent-statusline",
    "opencode-sdd-engram-manage",
    "opencode-custom-logo"   // ← add this
  ]
}
```

### Without Gentle AI (fresh OpenCode install)

Create the file from scratch:

```bash
cat > ~/.config/opencode/tui.json << 'EOF'
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-custom-logo"]
}
EOF
```

**That's it.** No `npm install`, no commands. OpenCode downloads the plugin automatically the next time it starts.

Restart OpenCode and you'll see the default "OpenCode" banner.

---

## Customize your logo

Create `~/.config/opencode/custom-logo.json` with your ASCII art:

```json
{
  "art": [
    "  ██╗    ██╗██████╗ ███████╗██╗      ██████╗ █████╗ ███╗   ██╗████████╗ ██████╗ ",
    "  ██║    ██║██╔══██╗██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗",
    "  ██║ █╗ ██║██║  ██║█████╗  ██║     ██║     ███████║██╔██╗ ██║   ██║   ██║   ██║",
    "  ██║███╗██║██║  ██║██╔══╝  ██║     ██║     ██╔══██║██║╚██╗██║   ██║   ██║   ██║",
    "  ╚███╔███╔╝██████╔╝███████╗███████╗╚██████╗██║  ██║██║ ╚████║   ██║   ╚██████╔╝",
    "   ╚══╝╚══╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ "
  ],
  "compact": "⚡ My Project",
  "color": "cyan"
}
```

Restart OpenCode. Your logo appears on the home screen.

> **Want to change it later?** Just edit `custom-logo.json` and restart OpenCode. The plugin source code is never touched.

### If the terminal is too small

The plugin automatically switches to the `compact` text when your terminal window is narrow or short. Set `minWidth` and `minHeightExtra` to tune when this happens.

---

## Config reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `art` | `string[]` | OpenCode banner | ASCII art lines — one string per row |
| `compact` | `string` | `"✦ OpenCode ✦"` | Fallback text for small terminals |
| `color` | `string` | `"accent"` | `"accent"` = theme accent, or any ANSI color (`"cyan"`, `"magenta"`, `"#ff69b4"`) |
| `order` | `number` | `200` | Slot priority — higher beats other logo plugins |
| `minWidth` | `number` | `64` | Minimum columns to show full art (falls back to `compact`) |
| `minHeightExtra` | `number` | `6` | Extra rows beyond art length required for UI chrome |

### No config file?

If `custom-logo.json` doesn't exist, the plugin falls back to the default "OpenCode" banner in your theme's accent color. You can always start with the defaults and add a config later — just restart after creating it.

---

## Replacing Gentle AI's logo

If you installed OpenCode through [Gentle AI](https://github.com/Gentleman-Programming/gentle-ai), it registered its own logo (`gentle-logo`). This plugin uses `order: 200` (vs Gentle AI's `100`), so it **automatically wins** — no extra config needed.

If you want to fully remove Gentle AI's logo from your setup:

```jsonc
// ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    // "opencode-subagent-statusline",  ← keep if you use it
    // "opencode-sdd-engram-manage",    ← keep if you use it
    "opencode-custom-logo"
    // No more gentle-logo.tsx entry
  ]
}
```

---

## Uninstall

Remove `"opencode-custom-logo"` from your `tui.json` plugin array and restart OpenCode. Optionally delete `~/.config/opencode/custom-logo.json` and the npm cache:

```bash
rm -rf ~/.config/opencode/custom-logo.json
rm -rf ~/.cache/opencode/packages/opencode-custom-logo*
```

---

## ASCII art generators

- [patorjk.com](https://patorjk.com/software/taag/) — FIGlet fonts
- [asciiart.eu](https://www.asciiart.eu/) — curated collections
- [textkool.com](https://textkool.com/en/ascii-art-generator) — simple text → ASCII

---

## Troubleshooting

### The plugin doesn't show up

Check OpenCode logs for errors:

```bash
grep -i "custom-logo\|failed to load tui" ~/.local/share/opencode/log/*.log
```

### OpenCode still shows the old logo after updating config

Make sure you restarted OpenCode. The config is read once at startup.

### I installed a new version but nothing changed

Clear the cached package and restart:

```bash
rm -rf ~/.cache/opencode/packages/opencode-custom-logo*
```

---

## Local development

```bash
npm install --ignore-scripts
npm run build

# Test locally — point OpenCode at the built file
# ~/.config/opencode/tui.json
# { "plugin": ["/absolute/path/to/opencode-custom-logo/dist/tui.js"] }
```

---

## License

MIT
