---
title: Sandbox
slug: /tools/sandbox
---

# Ubuntu Sandbox (exec-server MCP)

[![Join Discord](https://img.shields.io/badge/Join-Discord-purple)](https://discord.com/invite/QRfjg4YNzU)
[![View API Docs](https://img.shields.io/badge/View-API%20Docs-blue)](https://chat.ruska.ai/api)
[![Follow Social](https://img.shields.io/badge/Follow-Social-black)](https://ruska.ai/socials)

The ubuntu sandbox is a standalone MCP server that runs inside an isolated Docker container and exposes tools over the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport at `/mcp`. It supports optional API key authentication, session state via `mcp-session-id`, and a `/health` endpoint for monitoring.

- Source code: [ruska-ai/sandboxes](https://github.com/ruska-ai/sandboxes)
- Container images: [ghcr.io/ruska-ai/sandbox](https://github.com/ruska-ai/sandboxes/pkgs/container/sandbox)

## Tools

The server exposes a single tool:

### `exec_command`

Execute a shell command inside the container and return stdout/stderr.

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `cmd`     | string | Yes      | The shell command to execute   |

Commands run as an unprivileged `executor` user in `/home/executor` with a 120-second timeout and 10 MB output buffer. The container image (Debian Bookworm) ships with `curl`, `jq`, `node` (v22), and `gh` (GitHub CLI) pre-installed.

**Response format:**

```text
stdout:
<command stdout>
stderr:
<command stderr>
exit_code: <code>
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- Clone the sandboxes repo:

```bash
git clone https://github.com/ruska-ai/sandboxes.git
cd sandboxes
```

## Quick Start

### From source

```bash
cd ubuntu
docker build -t exec-server .
docker run -p 3005:3005 exec-server
```

### From GHCR

```bash
docker run -p 3005:3005 -e API_KEY=my-secret ghcr.io/ruska-ai/sandbox:ubuntu-latest
```

Verify the server is running:

```bash
curl http://localhost:3005/health
# {"status":"ok","sessions":0}
```

## Environment Variables

| Variable  | Required | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `API_KEY` | No       | If set, all `/mcp` requests must include `x-api-key` header   |
| `PORT`    | No       | Server port (default: `3005`)                                  |

Example:

```bash
docker run -p 3005:3005 -e API_KEY=my-secret ghcr.io/ruska-ai/sandbox:ubuntu-latest
```

## Testing with MCP Inspector

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) lets you interactively test the server before connecting it to an assistant.

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:

1. Set **Transport Type** to `Streamable HTTP`
2. Set **URL** to `http://localhost:3005/mcp`
3. If `API_KEY` is set, add a header: `x-api-key: <your key>`
4. Click **Connect**
5. Navigate to the **Tools** tab — you should see `exec_command`
6. Click `exec_command`, enter `{"cmd": "echo hello world"}`, and click **Run** to verify output

### Manual curl test

```bash
# 1. Initialize a session
curl -s -X POST http://localhost:3005/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": { "name": "test", "version": "1.0.0" }
    },
    "id": 1
  }'

# Note the mcp-session-id response header for subsequent requests

# 2. Call exec_command
curl -s -X POST http://localhost:3005/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <SESSION_ID>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "exec_command",
      "arguments": { "cmd": "echo hello world" }
    },
    "id": 2
  }'
```

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
- "Clone a repo with `gh` and list its contents"

The assistant will invoke the `exec_command` tool with the appropriate shell command and return the output.

## Troubleshooting

| Issue | Solution |
| ----- | -------- |
| Container not running | Run `docker run -p 3005:3005 ghcr.io/ruska-ai/sandbox:ubuntu-latest` and check `docker logs` |
| Health check fails | Ensure port `3005` is not in use and the container is running with `docker ps` |
| Authentication error (401) | Verify the `x-api-key` header matches the `API_KEY` env var on the container |
| Tool not appearing in Orchestra | Confirm the MCP config is saved and the URL is reachable from the Orchestra backend |
| Command timeout | Commands have a 120-second limit; break long-running tasks into smaller steps |
| Permission denied | Commands run as unprivileged `executor` user; use `sudo` if available or rebuild the image |
