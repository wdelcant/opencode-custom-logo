// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui";
import { useTerminalDimensions } from "@opentui/solid";
import { createMemo } from "solid-js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import os from "os";

// ── Config ──────────────────────────────────────────────────────────────────

const CONFIG_PATH = join(
  os.homedir(),
  ".config",
  "opencode",
  "custom-logo.json",
);

interface LogoConfig {
  art?: string[];
  compact?: string;
  color?: string;
  order?: number;
  minWidth?: number;
  minHeightExtra?: number;
}

// ── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_ART = [
  "   ██████╗██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗    ██╗      ██████╗  ██████╗  ██████╗ ",
  "  ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║    ██║     ██╔═══██╗██╔════╝ ██╔═══██╗",
  "  ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║    ██║     ██║   ██║██║  ███╗██║   ██║",
  "  ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║    ██║     ██║   ██║██║   ██║██║   ██║",
  "  ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║    ███████╗╚██████╔╝╚██████╔╝╚██████╔╝",
  "   ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ",
  "",
  "                        edit ~/.config/opencode/custom-logo.json to use your own art",
];

const DEFAULT_COMPACT = "✦ Custom Logo — edit custom-logo.json ✦";
const DEFAULT_ORDER = 200;
const DEFAULT_MIN_WIDTH = 64;
const DEFAULT_MIN_HEIGHT_EXTRA = 6;

// ── Config reader ───────────────────────────────────────────────────────────

function readConfig(): LogoConfig {
  try {
    if (!existsSync(CONFIG_PATH)) return {};

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

// ── Resolved config (read once at module load, failsafe) ────────────────────

let config: LogoConfig;
try {
  config = readConfig();
} catch {
  config = {};
}

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
