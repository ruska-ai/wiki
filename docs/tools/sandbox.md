---
title: Sandbox
slug: /tools/sandbox
---

# Ubuntu Sandbox (exec-server MCP)

[![Join Discord](https://img.shields.io/badge/Join-Discord-purple)](https://discord.com/invite/QRfjg4YNzU)
[![View API Docs](https://img.shields.io/badge/View-API%20Docs-blue)](https://chat.ruska.ai/api)
[![Follow Social](https://img.shields.io/badge/Follow-Social-black)](https://ruska.ai/socials)

The ubuntu sandbox is a self-hosted MCP server that exposes a single tool — `exec_command` — for executing shell commands inside a Docker container. It uses the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport.

Source code: [ruska-ai/sandboxes](https://github.com/ruska-ai/sandboxes)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- The `sandboxes` submodule initialized:

```bash
git submodule update --init --recursive
```

## Quick Start

Start the exec server container:

```bash
cd orchestra
docker compose up exec_server --build -d
```

Verify the server is running:

```bash
curl http://localhost:3005/health
```

## Environment Variables

| Variable  | Required | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `API_KEY` | No       | If set, all `/mcp` requests must include `x-api-key` header   |
| `PORT`    | No       | Server port (default: `3005`)                                  |

## Connect to Orchestra

Add the sandbox as an MCP server in the Orchestra UI or API. See the [MCP docs](/tools/mcp) for general MCP configuration instructions.

### Connection Details

| Field     | Value                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| URL       | `http://exec_server:3005/mcp` (docker network) or `http://localhost:3005/mcp` (host)          |
| Transport | `streamable_http`                                                                              |
| Headers   | `{"x-api-key": "<API_KEY>"}` if auth is enabled, otherwise `{}`                               |

### JSON Configuration

Use the following in the MCP configuration JSON editor:

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

If `API_KEY` is not set on the server, omit the `headers` field or pass an empty object.

### API Example

```bash
curl -X 'POST' \
  'https://chat.ruska.ai/api/llm/thread' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "Run uname -a",
  "model": "anthropic:claude-sonnet-4-5",
  "mcp": {
    "exec_server": {
      "transport": "streamable_http",
      "url": "http://exec_server:3005/mcp",
      "headers": {}
    }
  },
  "tools": ["exec_command"]
}'
```

## Usage

Once connected, the `exec_command` tool is available to your assistant. Example prompts:

- "Run `uname -a` to check the OS"
- "Install python3 and run a hello world script"
- "List all files in the home directory"
- "Install curl and fetch https://httpbin.org/get"

The assistant will invoke the `exec_command` tool with the appropriate shell command and return the output.

## Troubleshooting

| Issue | Solution |
| ----- | -------- |
| Container not running | Run `docker compose up exec_server --build -d` and check `docker compose logs exec_server` |
| Health check fails | Ensure port `3005` is not in use and the container is healthy with `docker ps` |
| Authentication error (403) | Verify the `x-api-key` header matches the `API_KEY` env var on the container |
| Tool not appearing | Confirm the MCP config is saved and the URL is reachable from the Orchestra backend |
| Submodule not initialized | Run `git submodule update --init --recursive` from the repo root |
