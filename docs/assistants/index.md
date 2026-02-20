---
title: Assistants
slug: /assistants
sidebar_position: 3
---

# Assistants

Assistants are pre-configured AI agents with specific instructions, tools, and behaviors. Think of them as specialized team members that you can deploy for specific tasks, whether through the web interface or via API.

## Overview

Unlike ad-hoc chat conversations, Assistants maintain consistent behavior across multiple threads and can be configured with:

-   **Custom Instructions**: Define the assistant's role, personality, and expertise via [AGENTS.md files](./agents-md.md) or legacy instruction fields
-   **Tool Access**: Attach specific tools (search, MCP servers, A2A agents)
-   **Model Selection**: Choose the best model for the assistant's purpose
-   **Reusability**: Use the same assistant across many conversations

## Key Concepts

### What are Assistants?

Assistants are persistent configurations that define how an AI agent should behave. When you create an assistant, you're essentially creating a reusable AI persona that can be invoked anytime.

**Example Assistant Configurations:**

-   **Python Tutor**: Specializes in teaching Python, has access to code execution tools
-   **Research Assistant**: Configured with web search, focused on providing cited information
-   **Customer Support Agent**: Has access to company knowledge base via RAG, uses friendly tone
-   **Data Analyst**: Connected to database tools, provides insights and visualizations

### Assistants vs Direct Chat

| Feature      | Direct Chat            | Assistants                         |
| ------------ | ---------------------- | ---------------------------------- |
| Instructions | One-time system prompt | Persistent via [AGENTS.md](./agents-md.md) files |
| Tools        | Selected per thread    | Pre-configured, always available   |
| Consistency  | Varies by user input   | Consistent behavior across threads |
| API Access   | Limited                | Full programmatic control          |
| Use Case     | Quick questions        | Production deployments             |

### When to Use Assistants

**Use Assistants when you need:**

-   ✅ Consistent behavior across multiple conversations
-   ✅ To deploy AI agents programmatically via API
-   ✅ Specific tool configurations that don't change
-   ✅ Reusable AI personas for common tasks
-   ✅ Team-wide shared AI configurations

**Use Direct Chat when you need:**

-   ✅ Quick, one-off questions
-   ✅ Experimentation with different approaches
-   ✅ Flexibility to change tools mid-conversation

## Creating an Assistant

### Via Web Interface

1. Navigate to **Assistants** from the sidebar and click **New Agent** (or **Create your first agent** if you have none yet)
2. Fill in the **Name** field (required) and an optional **Description**
3. **Set instructions** — choose one of two tabs:
    - **Instructions** (recommended): Appends your text to the default system prompt. You can also reference a saved prompt using the **Browse** button
    - **System Prompt**: Completely replaces the default system prompt (advanced use)
    - For a composable, version-controllable approach, use an [AGENTS.md file](./agents-md.md) instead — switch to the **Editor** view in the file panel and create an `AGENTS.md` file
4. **Select a model** — click the model dropdown to pick from available providers (Anthropic, OpenAI, Google, Ollama, Groq, XAI, AWS Bedrock). Match the model to your use case — see [Model Selection](#model-selection) below
5. **Attach tools** — click **Manage Tools** to open the tool selection modal:
    - **Platform tools**: Built-in tools like `web_search`, `web_scrape`, `math_calculator`, and `think_tool`
    - **API tools**: Custom tools you've created (authenticated users only)
    - **MCP servers**: Connect external tools via [Model Context Protocol](../tools/mcp.md)
    - **A2A agents**: Connect other agents via [Agent-to-Agent protocol](../tools/a2a.md)
6. **Add subagents** (optional) — select other assistants to act as subagents for this assistant
7. Click **Save**

Your assistant is now ready to use in any new thread.

:::tip File-Based Instructions
Orchestra uses `AGENTS.md` files for assistant instructions — similar to how Claude Code uses `CLAUDE.md`. This approach makes your agent configuration version-controllable and composable. See the [AGENTS.md guide](./agents-md.md) for the full workflow.
:::

### Model Selection

Choose the right model for your assistant's purpose. Orchestra supports multiple providers:

| Provider | Best For | Example Models |
| --- | --- | --- |
| **Anthropic** | Reasoning, coding, analysis | Claude Sonnet, Claude Haiku, Claude Opus |
| **OpenAI** | Multi-modal, general purpose | GPT-4o, GPT-4o-mini |
| **Google** | Long context, multi-modal | Gemini Pro, Gemini Flash |
| **Ollama** | Local/private deployment | Llama, Mistral, and other open models |
| **Groq** | Low-latency inference | Llama, Mixtral (via Groq hardware) |
| **XAI** | General purpose | Grok models |
| **AWS Bedrock** | Enterprise deployments | Bedrock-hosted models |

:::tip Model Matching
- **Fast & cheap**: Use smaller models (Haiku, GPT-4o-mini, Gemini Flash) for simple tasks and high-volume use
- **Balanced**: Use mid-tier models (Sonnet, GPT-4o) for coding, analysis, and complex reasoning
- **Maximum capability**: Use top-tier models (Opus) for the most demanding tasks
:::

### Tool Attachment

The tool selection modal organizes tools into four categories:

**Platform Tools** — built-in tools available to all users:
- `web_search`: Search the web for current information
- `web_scrape`: Extract content from web pages
- `math_calculator`: Perform mathematical calculations
- `think_tool`: Give the assistant a scratchpad for step-by-step reasoning

**API Tools** — custom tools you define with HTTP endpoints (authenticated users only). See [Tools & Integrations](../tools/tools.md) for how to create custom tools.

**MCP Servers** — connect external tool servers via the [Model Context Protocol](../tools/mcp.md). Configure each server with a name, transport type, URL, and optional authentication headers.

**A2A Agents** — connect other AI agents via the [Agent-to-Agent protocol](../tools/a2a.md). Each A2A connection needs a base URL and agent card path.

:::tip Tool Scoping
Only attach tools the assistant actually needs. Fewer tools means faster responses and lower costs.
:::

### Via API

Create an assistant programmatically using the REST API. Use the `files` dictionary with an `AGENTS.md` key to define instructions:

```bash
curl -X 'POST' \
  'https://chat.ruska.ai/api/assistants' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Python Tutor",
  "model": "anthropic:claude-sonnet-4-5",
  "tools": ["web_search"],
  "files": {
    "AGENTS.md": "# Python Tutor\n\nYou are an expert Python programming tutor. You explain concepts clearly, provide working code examples, and help debug issues step-by-step. Always use best practices and explain why."
  }
}'
```

**Response:**

```json
{
    "assistant_id": "asst_abc123"
}
```

:::info Legacy `instructions` Field
You can still use the `instructions` field directly, but `AGENTS.md` in `files` takes priority when both are present. See [AGENTS.md: File-Based Instructions](./agents-md.md) for the full precedence rules.
:::

## Using Assistants

### Starting a Thread with an Assistant

**Via Web Interface:**

1. Click on an assistant in the sidebar
2. A new thread starts automatically with that assistant's configuration
3. Send your message - the assistant responds according to its instructions

**Via API:**

```bash
curl -X 'POST' \
  'https://chat.ruska.ai/api/thread' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "assistant_id": "asst_abc123",
  "query": "Explain how list comprehensions work in Python",
  "metadata": {
    "current_utc": "2025-01-16T14:30:00Z",
    "timezone": "America/New_York",
    "language": "en-US"
  }
}'
```

The thread will inherit the assistant's configuration (instructions, tools, model).

## Managing Assistants

### Updating an Assistant

Modify an assistant's configuration at any time. Update the `AGENTS.md` file in the `files` dictionary:

```bash
curl -X 'PUT' \
  'https://chat.ruska.ai/api/assistants/asst_abc123' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Python Tutor",
  "files": {
    "AGENTS.md": "# Updated Instructions\n\nNew instructions content here..."
  },
  "tools": ["web_search"]
}'
```

:::warning Existing Threads
Updating an assistant does not affect existing threads. Only new threads will use the updated configuration.
:::

### Deleting an Assistant

Remove an assistant when no longer needed:

```bash
curl -X 'DELETE' \
  'https://chat.ruska.ai/api/assistants/asst_abc123'
```

### Listing Your Assistants

Search for assistants in your account:

```bash
curl -X 'POST' \
  'https://chat.ruska.ai/api/assistants/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "limit": 200,
  "offset": 0,
  "sort": "updated_at",
  "sort_order": "desc"
}'
```

### Publishing an Assistant

Make an assistant publicly available for others to discover and use:

```bash
curl -X 'POST' \
  'https://chat.ruska.ai/api/assistants/asst_abc123/publish'
```

To unpublish:

```bash
curl -X 'DELETE' \
  'https://chat.ruska.ai/api/assistants/asst_abc123/publish'
```

Browse public assistants without authentication:

```bash
curl -X 'GET' \
  'https://chat.ruska.ai/api/assistants/public?limit=50&offset=0'
```

## Advanced Configuration

### Tool Integration

Assistants can combine multiple tool types in a single configuration:

```json
{
    "name": "Research Assistant",
    "model": "anthropic:claude-sonnet-4-5",
    "tools": ["web_search"],
    "files": {
        "AGENTS.md": "# Research Assistant\n\nYou are a research assistant..."
    },
    "mcp": {
        "ruska_mcp": {
            "transport": "sse",
            "url": "https://mcp.example.com/sse",
            "headers": {
                "x-api-key": "your_api_key"
            }
        }
    },
    "a2a": {
        "external_agent": {
            "base_url": "https://a2a.example.com",
            "agent_card_path": "/.well-known/agent.json"
        }
    }
}
```

This assistant has access to:

-   Built-in web search tool
-   MCP server tools (via Server-Sent Events transport)
-   A2A agent capabilities

### Metadata for System Prompts

The `metadata` property supports three fields that are automatically appended to system prompts:

```json
{
    "name": "Marketing Copy Writer",
    "model": "anthropic:claude-sonnet-4-5",
    "files": {
        "AGENTS.md": "# Marketing Copy Writer\n\nYou are a professional copywriter..."
    },
    "metadata": {
        "current_utc": "2025-01-16T10:00:00Z",
        "timezone": "America/Los_Angeles",
        "language": "en-US"
    }
}
```

**Supported metadata fields:**

-   **`current_utc`**: Current timestamp (ISO 8601 format) - useful for time-aware responses
-   **`timezone`**: User's timezone (e.g., "America/Denver", "Europe/London")
-   **`language`**: User's language preference (e.g., "en-US", "es-ES", "fr-FR")

These values are appended to the end of the system prompt, providing context to the AI model.

### Scheduled Assistants

Combine assistants with the [Schedules API](https://chat.ruska.ai/api#/Schedule) to create recurring agent tasks:

-   Daily report generation
-   Periodic data analysis
-   Automated monitoring and alerts
-   Content publication workflows

See the **Schedules** section in your user settings for more information.

## Best Practices

:::tip Clear Instructions
Be specific in your AGENTS.md. Instead of "helpful assistant," try "You are a technical documentation writer who explains complex topics simply, uses examples, and always includes code snippets." See the [AGENTS.md guide](./agents-md.md) for writing tips.
:::

:::info Version Control
Since AGENTS.md is a file, you can store it in Git alongside your project code. This gives you version history, team review, and reproducible agent configurations.
:::

:::warning API Keys in Tools
Store sensitive credentials (MCP keys, A2A tokens) securely. Never commit them to version control.
:::

## Examples

### Example 1: Code Review Assistant

```json
{
    "name": "Code Reviewer",
    "model": "anthropic:claude-sonnet-4-5",
    "tools": [],
    "files": {
        "AGENTS.md": "# Code Reviewer\n\nYou are an expert code reviewer. Analyze code for:\n- Bugs and logic errors\n- Performance issues\n- Security vulnerabilities\n- Code style and best practices\n\nProvide specific, actionable feedback with examples."
    }
}
```

### Example 2: Customer Support with Knowledge Base

```json
{
    "name": "Support Agent",
    "model": "openai:gpt-4o",
    "tools": ["web_search"],
    "files": {
        "AGENTS.md": "# Support Agent\n\nYou are a friendly customer support agent. Use the knowledge base to answer questions accurately. If you don't know, escalate to a human agent. Always be empathetic and solution-focused."
    }
}
```

### Example 3: Data Analysis Agent

```json
{
    "name": "Data Analyst",
    "model": "anthropic:claude-sonnet-4-5",
    "files": {
        "AGENTS.md": "# Data Analyst\n\nYou are a data analyst specialized in business intelligence. Analyze data, create insights, and suggest actionable recommendations. Use visualizations when helpful."
    },
    "a2a": {
        "sql_agent": {
            "base_url": "https://sql-agent.example.com",
            "agent_card_path": "/.well-known/agent.json"
        }
    }
}
```

## API Reference

For complete API documentation, see:

-   [Assistant API Reference](https://chat.ruska.ai/api#/Assistant)
-   [Create Assistant](https://chat.ruska.ai/api#/Assistant/Create_Assistant)
-   [Update Assistant](https://chat.ruska.ai/api#/Assistant/Update_Assistant)
-   [Delete Assistant](https://chat.ruska.ai/api#/Assistant/Delete_Assistant)
-   [List Assistants](https://chat.ruska.ai/api#/Assistant/List_Assistants)

## Related Documentation

-   **[AGENTS.md: File-Based Instructions](./agents-md.md)**: Configure assistants using version-controllable Markdown files
-   **[Threads](../threads/index.md)**: Learn about conversation management
-   **[Tools](../tools/tools.md)**: Explore available tool integrations
-   **[MCP Integration](../tools/mcp.md)**: Connect Model Context Protocol servers
-   **[A2A Integration](../tools/a2a.md)**: Enable agent-to-agent communication
-   **[Storage](../storage/index.md)**: Add knowledge bases to your assistants

---

**Next Steps**: Create your first assistant and [start a thread](../threads/index.md) to see it in action!
