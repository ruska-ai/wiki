import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "index",
    "getting-started",
    "self-hosting/index",
    {
      type: "category",
      label: "Core Features",
      items: ["assistants/index", "threads/index", "schedules/index", "projects/index", "storage/index", "memories/index",
        {
          type: "category",
          label: "AGENTS.md",
          link: { type: "doc", id: "agents-md/index" },
          items: ["agents-md/tutorial"],
        },
      ],
    },
    {
      type: "category",
      label: "Tools & Integrations",
      items: ["tools/tools", "tools/search", "tools/mcp", "tools/sandbox", "tools/a2a"],
    },
    {
      type: "category",
      label: "Tutorials",
      items: ["tools/sandbox-tutorial", "memories/tutorial"],
    },
  ],
};

export default sidebars;
