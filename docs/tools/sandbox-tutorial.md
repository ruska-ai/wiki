---
title: "Connect Ubuntu Sandbox MCP to Assistant"
slug: /tools/sandbox-tutorial
sidebar_position: 5
---

# Connect Ubuntu Sandbox MCP to Assistant

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

1. Navigate to your assistant's page and click the **Config** tab.
2. Click **Edit**, then click **Manage Tools**.
3. In the Tool Selection modal, click the **MCP Servers** tab.

This panel shows your configured MCP servers and lets you add new ones.

![MCP Servers Tab](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-mcp-tab.png?raw=true)

## Step 3: Add the Sandbox MCP Server

Click **Add Server** and fill in the form (you can use any server name):

| Field | Value |
| ----- | ----- |
| **Server Name** | `ubuntu-sandbox` |
| **Transport** | `Streamable HTTP` |
| **URL** | `http://localhost:3005/mcp` |

:::tip When to use which URL
- Use `http://exec_server:3005/mcp` when both Orchestra and the sandbox are running in Docker containers on the same network (the default for `docker-compose` deployments).
- Use `http://localhost:3005/mcp` when the sandbox is running on your host machine and Orchestra is accessing it directly.
- Use `http://<SANDBOX_IP>:3005/mcp` when the sandbox runs on another machine reachable over the network.
:::

If your sandbox has `API_KEY` set, add the key in the **Header Key** / **Header Value** fields:

| Field | Value |
| ----- | ----- |
| **Header Key** | `x-api-key` |
| **Header Value** | `your_api_key` |

Click **Add Server** to save the configuration.

![MCP Config Form](https://github.com/ryaneggz/static/blob/main/enso/sandbox-tutorial-config.png?raw=true)

### Example configurations

| Scenario | Server Name | URL | Header Key | Header Value |
| --- | --- | --- | --- | --- |
| Docker Compose (alias) | `ubuntu-sandbox` | `http://exec_server:3005/mcp` |  |  |
| Localhost | `local-sandbox` | `http://localhost:3005/mcp` |  |  |
| Remote IP (no auth) | `remote-sandbox` | `http://203.0.113.10:3005/mcp` |  |  |
| Remote DNS (TLS) | `sandbox-prod` | `https://sandbox.example.com/mcp` |  |  |
| Remote IP (API key) | `prod-sandbox` | `http://203.0.113.10:3005/mcp` | `x-api-key` | `your_api_key` |

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
