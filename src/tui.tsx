// @ts-nocheck — JSX slot return types vary across @opentui versions
/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui";
import { useTerminalDimensions } from "@opentui/solid";
import { createMemo } from "solid-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

// ── Config ──────────────────────────────────────────────────────────────────

const CONFIG_PATH = join(
  os.homedir(),
  ".config",
  "opencode",
  "custom-logo.json",
);

interface LogoConfig {
  /**
   * ASCII art lines for big terminals (≥64 cols, enough height).
   * Each string is one row.
   * @default opencode default art (see DEFAULT_ART)
   */
  art?: string[];

  /**
   * Fallback text shown when the terminal is too small for the full art.
   * @default "✦ OpenCode ✦"
   */
  compact?: string;

  /**
   * Text color.
   * - `"accent"` (default) → uses the active theme's accent color
   * - Any other string (e.g. `"magenta"`, `"cyan"`, `"#ff69b4"`) → literal color
   */
  color?: string;

  /**
   * Slot priority — higher numbers win when multiple logo plugins are registered.
   * Gentle AI's gentle-logo uses 100, so defaulting to 200 ensures this wins.
   * @default 200
   */
  order?: number;

  /**
   * Minimum terminal width (columns) required to show the full art.
   * @default 64
   */
  minWidth?: number;

  /**
   * Minimum terminal height (rows) required to show the full art.
   * Computed as art.length + padding.
   * @default 6
   */
  minHeightExtra?: number;
}

// ── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_ART = [
  "  ██████╗ ██████╗ ███████╗███╗   ██╗",
  " ██╔═══██╗██╔══██╗██╔════╝████╗  ██║",
  " ██║   ██║██████╔╝█████╗  ██╔██╗ ██║",
  " ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║",
  " ╚██████╔╝██║     ███████╗██║ ╚████║",
  "  ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝",
];

const DEFAULT_COMPACT = "✦ OpenCode ✦";
const DEFAULT_ORDER = 200;
const DEFAULT_MIN_WIDTH = 64;
const DEFAULT_MIN_HEIGHT_EXTRA = 6;

// ── Config reader ───────────────────────────────────────────────────────────

function readConfig(): LogoConfig {
  if (!existsSync(CONFIG_PATH)) return {};

  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    const cfg = parsed as Record<string, unknown>;

    return {
      art: Array.isArray(cfg.art)
        ? cfg.art.filter((l): l is string => typeof l === "string")
        : undefined,
      compact: typeof cfg.compact === "string" ? cfg.compact : undefined,
      color: typeof cfg.color === "string" ? cfg.color : undefined,
      order: typeof cfg.order === "number" ? cfg.order : undefined,
      minWidth:
        typeof cfg.minWidth === "number" ? cfg.minWidth : undefined,
      minHeightExtra:
        typeof cfg.minHeightExtra === "number"
          ? cfg.minHeightExtra
          : undefined,
    };
  } catch {
    return {};
  }
}

// ── Resolved config (read once at module load) ──────────────────────────────

const config = readConfig();

const art: string[] = config.art ?? DEFAULT_ART;
const compact: string = config.compact ?? DEFAULT_COMPACT;
const color: string = config.color ?? "accent";
const minWidth: number = config.minWidth ?? DEFAULT_MIN_WIDTH;
const minHeightExtra: number =
  config.minHeightExtra ?? DEFAULT_MIN_HEIGHT_EXTRA;

// ── Logo component ──────────────────────────────────────────────────────────

const Logo = (props: { theme: TuiThemeCurrent }) => {
  const dim = useTerminalDimensions();

  const lines = createMemo(() => {
    const term = dim();
    return term.height >= art.length + minHeightExtra && term.width >= minWidth
      ? art
      : [compact];
  });

  // Resolve color: "accent" → theme.accent, anything else → literal string
  const fg = (): string | TuiThemeCurrent["accent"] =>
    (
      color === "accent" ? props.theme.accent : color
    ) as string | TuiThemeCurrent["accent"];

  return (
    <box flexDirection="column" alignItems="center">
      {lines().map((line) => (
        <text fg={fg()}>{line}</text>
      ))}
    </box>
  );
};

// ── Plugin registration ─────────────────────────────────────────────────────

const tui: TuiPlugin = async (api) => {
  api.slots.register({
    id: "custom-logo",
    order: config.order ?? DEFAULT_ORDER,
    slots: {
      home_logo(ctx) {
        return <Logo theme={ctx.theme.current} />;
      },
    },
  });
};

const plugin = { id: "opencode-custom-logo", tui };
export default plugin;
