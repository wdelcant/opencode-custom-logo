## Install

### Option 1: Download & drop (recommended)

```bash
# Download the plugin file
curl -o ~/.config/opencode/tui-plugins/custom-logo.tsx \
  https://raw.githubusercontent.com/wdelcant/opencode-custom-logo/main/custom-logo.tsx

# Register it in OpenCode's TUI config
cat >> ~/.config/opencode/tui.json << 'EOF'
// Add this path to the "plugin" array — it'll look like:
// "plugin": [
//   ...existing plugins...,
//   "/Users/YOUR_USER/.config/opencode/tui-plugins/custom-logo.tsx"
// ]
EOF
```

Restart OpenCode. You'll see the default "CUSTOM LOGO" banner.

### Option 2: npm install + copy

```bash
npm install opencode-custom-logo
cp node_modules/opencode-custom-logo/custom-logo.tsx ~/.config/opencode/tui-plugins/
```

Then add the path to `tui.json` as shown above.
