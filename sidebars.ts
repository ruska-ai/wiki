import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "index",
    "getting-started",
    "self-hosting/index",
    {
      type: "category",
      label: "Core Features",
      items: ["assistants/index", "threads/index", "storage/index"],
    },
    {
      type: "category",
      label: "Tools & Integrations",
      items: ["tools/tools", "tools/search", "tools/mcp", "tools/sandbox", "tools/sandbox-tutorial", "tools/a2a"],
    },
  ],
};

export default sidebars;
