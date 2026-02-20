---
title: Memories
slug: /memories
sidebar_position: 4
---

# Memories

Memories are persistent, per-user context snippets that Orchestra automatically injects into every agent conversation. They allow your AI assistants to remember preferences, facts, and instructions across threads without repeating yourself.

## Overview

-   **Persistent Context**: Memories survive across threads and sessions
-   **Per-User Scoping**: Each user has their own private set of memories, namespaced by user ID
-   **Automatic Injection**: Memories are retrieved and injected into agent context as `/memories.md` at the start of every conversation
-   **LangGraph BaseStore**: Memories are stored via LangGraph's BaseStore, providing a reliable key-value persistence layer
-   **Full CRUD API**: Create, read, update, and delete memories programmatically

## How It Works

The memories lifecycle follows this flow:

1. **Create a Memory** - A user creates a memory via the API or the Settings UI (e.g., "I prefer Python for backend development")
2. **Stored in LangGraph BaseStore** - The memory is persisted in the LangGraph BaseStore, namespaced by user ID
3. **Automatic Retrieval** - When a conversation starts, `prepare_memory_files()` fetches all memories for the current user
4. **Injected as Markdown** - Memories are formatted as a bullet list and injected as the `/memories.md` file into the agent's context
5. **Personalized Responses** - The agent reads the memories and tailors its responses accordingly

This happens automatically in every entry point — streaming, worker, and invoke — so you never need to manually pass memories into conversations.

## API Reference

All memory endpoints require authentication via a Bearer token in the `Authorization` header.

### List Memories

Retrieve all memories for the authenticated user with optional filtering.

```bash
curl -X 'GET' \
  'http://localhost:8000/api/memories?limit=10&offset=0&query=' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>'
```

**Query Parameters:**

-   `limit` (int, default: 10, max: 100) - Number of memories to return
-   `offset` (int, default: 0) - Number of memories to skip
-   `query` (string, default: "") - Search filter for memory content

**Response:**

```json
{
    "memories": [
        {
            "id": "mem_abc123",
            "content": "I prefer Python for backend development and TypeScript for frontend.",
            "metadata": null,
            "created_at": "2025-01-16T10:30:00Z",
            "updated_at": "2025-01-16T10:30:00Z"
        }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
}
```

### Get a Single Memory

Retrieve a specific memory by ID.

```bash
curl -X 'GET' \
  'http://localhost:8000/api/memories/mem_abc123' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>'
```

**Response:**

```json
{
    "id": "mem_abc123",
    "content": "I prefer Python for backend development and TypeScript for frontend.",
    "metadata": null,
    "created_at": "2025-01-16T10:30:00Z",
    "updated_at": "2025-01-16T10:30:00Z"
}
```

### Create a Memory

Create a new memory for the authenticated user.

```bash
curl -X 'POST' \
  'http://localhost:8000/api/memories' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
  "content": "I prefer Python for backend development and TypeScript for frontend.",
  "metadata": {"category": "preferences"}
}'
```

**Request Body:**

-   `content` (string, required) - The memory text (min length: 1)
-   `metadata` (object, optional) - Arbitrary key-value metadata

**Response (201 Created):**

```json
{
    "id": "mem_abc123",
    "content": "I prefer Python for backend development and TypeScript for frontend.",
    "metadata": {"category": "preferences"},
    "created_at": "2025-01-16T10:30:00Z",
    "updated_at": "2025-01-16T10:30:00Z"
}
```

### Update a Memory

Update an existing memory by ID.

```bash
curl -X 'PUT' \
  'http://localhost:8000/api/memories/mem_abc123' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
  "content": "I prefer Python for backend and TypeScript for frontend. My timezone is America/Chicago.",
  "metadata": {"category": "preferences"}
}'
```

**Request Body:**

-   `content` (string, required) - The updated memory text (min length: 1)
-   `metadata` (object, optional) - Updated metadata

**Response:**

```json
{
    "id": "mem_abc123",
    "content": "I prefer Python for backend and TypeScript for frontend. My timezone is America/Chicago.",
    "metadata": {"category": "preferences"},
    "created_at": "2025-01-16T10:30:00Z",
    "updated_at": "2025-01-16T14:00:00Z"
}
```

### Delete a Memory

Delete a memory by ID.

```bash
curl -X 'DELETE' \
  'http://localhost:8000/api/memories/mem_abc123' \
  -H 'Authorization: Bearer <token>'
```

**Response:** `204 No Content`

## Managing Memories via the UI

You can manage memories through the Orchestra web interface without writing any code.

### Creating a Memory

1. Navigate to **Settings** from the sidebar
2. Scroll to the **Memories** card
3. Click **Add Memory** in the top-right corner
4. Enter the context you want the AI to remember (e.g., "I prefer Python for backend development")
5. Click **Save**

### Editing a Memory

1. In the Memories card, hover over the memory you want to edit
2. Click the **pencil icon** to open the editor
3. Update the content and click **Save**

### Deleting a Memory

1. Hover over the memory you want to remove
2. Click the **trash icon**
3. Confirm deletion in the dialog

### Searching Memories

Use the **search bar** at the top of the Memories card to filter memories by content. This is helpful when you have many stored memories.

:::tip Focused Memories
Keep each memory focused on a single topic for best results. All memories are automatically injected into every conversation, so clear, specific memories produce better AI responses.
:::

For a detailed walkthrough with screenshots, see the [Memory Tutorial](./tutorial.md).

## Memories and AGENTS.md

Memories and [AGENTS.md instructions](../assistants/agents-md.md) are complementary systems that work at different layers:

| | Memories | AGENTS.md |
| --- | --- | --- |
| **Scope** | Per-user, across all conversations | Per-assistant or per-thread |
| **Purpose** | User preferences, facts, and context | Assistant behavior and role instructions |
| **Injection** | Loaded into the agent's virtual filesystem as `/memories.md` | Injected into the system prompt as `INSTRUCTIONS` |
| **Persistence** | Stored in database, survives across sessions | Stored in assistant `files` dictionary |

**How they work together**: When a conversation starts, Orchestra first loads your memories into the agent's context, then applies the assistant's AGENTS.md instructions to the system prompt. This means your assistant follows its configured role (via AGENTS.md) while also having access to your personal preferences (via memories).

**User files take priority**: If you explicitly provide a file with the same name as a memory file, your file overrides the memory. This lets you temporarily override stored context when needed.

## Related Documentation

-   **[Assistants](../assistants/index.md)**: Create AI agents that leverage your memories
-   **[AGENTS.md: File-Based Instructions](../assistants/agents-md.md)**: Configure assistant behavior alongside memories
-   **[AGENTS.md Workflow Tutorial](../agents-md/tutorial.md)**: Step-by-step guide for file-based instructions
-   **[Threads](../threads/index.md)**: Start conversations where memories are automatically applied
-   **[Storage](../storage/index.md)**: Manage files and knowledge bases

---

**Ready to personalize your AI experience?** Create your first memory via the API above or through the [Settings UI](./tutorial.md)!
