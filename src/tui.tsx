// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiPlugin } from "@opencode-ai/plugin/tui";

const tui: TuiPlugin = async (api) => {
  api.slots.register({
    id: "custom-logo",
    order: 999,
    slots: {
      home_logo() {
        return <text fg="magenta">✦ PLUGIN LOADED ✦</text>;
      },
    },
  });
};

const plugin = { id: "opencode-custom-logo", tui };
export default plugin;
