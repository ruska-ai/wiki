import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "index",
    "getting-started",
    "self-hosting/index",
    {
      type: "category",
      label: "Core Features",
      items: ["assistants/index", "threads/index", "storage/index", "memories/index", "agents-md/index"],
    },
    {
      type: "category",
      label: "Tools & Integrations",
      items: ["tools/tools", "tools/search", "tools/mcp", "tools/sandbox", "tools/a2a"],
    },
    {
      type: "category",
      label: "Tutorials",
      items: ["tools/sandbox-tutorial", "memories/tutorial", "agents-md/tutorial"],
    },
  ],
};

export default sidebars;
