// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui";
import { useTerminalDimensions } from "@opentui/solid";
import { createMemo } from "solid-js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import os from "os";

const CONFIG_PATH = join(os.homedir(), ".config", "opencode", "custom-logo.json");

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

type DotColor = string | { color: string };

function readConfig(): Record<string, any> {
  try {
    if (!existsSync(CONFIG_PATH)) return {};
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

const config = readConfig();
const art: string[] = config.art ?? DEFAULT_ART;
const compact: string = config.compact ?? DEFAULT_COMPACT;
const color: string = config.color ?? "accent";
const dots: DotColor[] | undefined = config.dots;

// ── Logo component ──────────────────────────────────────────────────────────

const resolveColor = (c: string, theme: TuiThemeCurrent) =>
  c === "accent" ? theme.accent : c;

const Logo = (props: { theme: TuiThemeCurrent }) => {
  const dim = useTerminalDimensions();

  const lines = createMemo(() => {
    const term = dim();
    return term.height >= art.length + (dots ? 2 : 0) + 6 && term.width >= 64
      ? art
      : [compact];
  });

  const showDots = createMemo(() => {
    if (!dots || dots.length === 0) return false;
    const term = dim();
    return term.height >= art.length + 6 && term.width >= 64;
  });

  // Find longest line to align dots to the right
  const maxLen = createMemo(() =>
    Math.max(...lines().map((l) => l.length), 0),
  );

  return (
    <box flexDirection="column" alignItems="center">
      {lines().map((line) => (
        <text fg={resolveColor(color, props.theme)}>{line}</text>
      ))}
      {showDots() && (
        <box flexDirection="row" justifyContent="flex-end" width={maxLen()}>
          {dots!.map((d) => {
            const dotColor = typeof d === "string" ? d : d.color ?? color;
            return <text fg={resolveColor(dotColor, props.theme)}> ●</text>;
          })}
        </box>
      )}
    </box>
  );
};

const tui: TuiPlugin = async (api) => {
  api.slots.register({
    id: "custom-logo",
    order: config.order ?? 300,
    slots: {
      home_logo(ctx) {
        return <Logo theme={ctx.theme.current} />;
      },
    },
  });
};

const plugin = { id: "opencode-custom-logo", tui };
export default plugin;
