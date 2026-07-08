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

function readConfig() {
  try {
    if (!existsSync(CONFIG_PATH)) return {};
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

const config = readConfig();
const art = config.art ?? DEFAULT_ART;
const compact = config.compact ?? DEFAULT_COMPACT;
const color = config.color ?? "accent";

const Logo = (props: { theme: TuiThemeCurrent }) => {
  const dim = useTerminalDimensions();
  const lines = createMemo(() => {
    const term = dim();
    return term.height >= art.length + 6 && term.width >= 64 ? art : [compact];
  });

  return (
    <box flexDirection="column" alignItems="center">
      {lines().map((line) => (
        <text fg={color === "accent" ? props.theme.accent : color}>{line}</text>
      ))}
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
