---
title: "Tutorial: Connect Ubuntu Sandbox to an Assistant"
slug: /tools/sandbox-tutorial
sidebar_position: 5
---

# Tutorial: Connect Ubuntu Sandbox to an Assistant

[![Join Discord](https://img.shields.io/badge/Join-Discord-purple)](https://discord.com/invite/QRfjg4YNzU)
[![View API Docs](https://img.shields.io/badge/View-API%20Docs-blue)](https://chat.ruska.ai/api)
[![Follow Social](https://img.shields.io/badge/Follow-Social-black)](https://ruska.ai/socials)

This tutorial walks you through connecting the [Ubuntu Sandbox](/tools/sandbox) to an Orchestra assistant using MCP (Model Context Protocol). By the end, your assistant will be able to execute shell commands inside an isolated Docker container.

## Prerequisites

Before starting, make sure you have:

- A running Ubuntu Sandbox container — see the [Sandbox documentation](/tools/sandbox) for Docker setup instructions
- An Orchestra account at [chat.ruska.ai](https://chat.ruska.ai)

## Step 1: Verify the Sandbox Is Running

Confirm your sandbox container is healthy by checking the `/health` endpoint:

```bash
curl http://localhost:3005/health
# {"status":"ok","sessions":0}
```

You should see `"status":"ok"` in the response. If the health check fails, refer to the [Troubleshooting section](/tools/sandbox#troubleshooting) in the Sandbox docs.

![Sandbox Health Check](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-health.png?raw=true)

## Step 2: Open MCP Configuration

1. In Orchestra, open the **Tool Selector** modal.
2. Click the MCP icon to open the **Add MCP Configuration** panel.

This panel contains a JSON editor where you define your MCP server connections.

![MCP Servers Tab](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-mcp-tab.png?raw=true)

## Step 3: Add the Sandbox MCP Server

Paste the following JSON configuration into the editor:

**If Orchestra and the sandbox are on the same Docker network** (e.g., using `docker-compose`):

```json
{
    "mcp": {
        "exec_server": {
            "transport": "streamable_http",
            "url": "http://exec_server:3005/mcp",
            "headers": {}
        }
    }
}
```

**If running the sandbox on your local machine** (outside Docker or for local development):

```json
{
    "mcp": {
        "exec_server": {
            "transport": "streamable_http",
            "url": "http://localhost:3005/mcp",
            "headers": {}
        }
    }
}
```

:::tip When to use which URL
- Use `http://exec_server:3005/mcp` when both Orchestra and the sandbox are running in Docker containers on the same network (the default for `docker-compose` deployments).
- Use `http://localhost:3005/mcp` when the sandbox is running on your host machine and Orchestra is accessing it directly.
:::

If your sandbox has `API_KEY` set, include the key in the `headers`:

```json
{
    "mcp": {
        "exec_server": {
            "transport": "streamable_http",
            "url": "http://exec_server:3005/mcp",
            "headers": {
                "x-api-key": "your_api_key"
            }
        }
    }
}
```

Click **Save Configuration** to store the settings.

![MCP Config Form](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-config.png?raw=true)

## Step 4: Fetch and Select Tools

After saving, Orchestra fetches the available tools from your sandbox. You should see **`exec_command`** listed as an available tool.

Select `exec_command` to enable it for your assistant.

![Tools Loaded](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-tools.png?raw=true)

## Step 5: Test with a Prompt

Close the configuration panel and send a test message to your assistant:

> Run `uname -a` to check the OS

The assistant will invoke the `exec_command` tool and return the output from the sandbox container.

![Execution Result](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-result.png?raw=true)

## Troubleshooting

If you run into issues, check the following:

| Issue | Solution |
| ----- | -------- |
| Sandbox not reachable | Verify the container is running with `docker ps` and the health endpoint responds |
| Wrong URL | Use `exec_server:3005` for Docker network, `localhost:3005` for host access |
| Authentication errors | Ensure `x-api-key` header matches the `API_KEY` environment variable |
| Tool not appearing | Re-save the MCP configuration and refresh the page |

For more details, see the [Sandbox reference documentation](/tools/sandbox) and [MCP documentation](/tools/mcp).
