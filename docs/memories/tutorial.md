---
title: "Tutorial: Configuring Memories"
sidebar_label: Memory Tutorial
sidebar_position: 1
---

# Tutorial: Configuring Memories

This tutorial walks you through adding memories via the Settings UI and verifying that they personalize your chat experience. By the end, your AI assistant will remember your preferences across all conversations.

## Prerequisites

-   An Orchestra account at [chat.ruska.ai](https://chat.ruska.ai)

## Step 1: Navigate to Settings

Open Orchestra and click on **Settings** in the sidebar navigation. Scroll down to the **Memories** card. When no memories have been created yet, you will see an empty state with the message "No memories yet. Add one to get started."

The Memories card includes:

-   A **search bar** for filtering existing memories
-   An **Add Memory** button in the top-right corner
-   A **memory list** (empty on first visit)

![Settings Memories Empty](/img/memories/settings-memories-empty.png)

## Step 2: Add a Memory

Click the **Add Memory** button to open the memory editor dialog. Enter the context you want the AI to remember. For example:

> I prefer Python for backend development and TypeScript for frontend. My timezone is America/Chicago.

You can use memories for any persistent context: preferences, project details, reminders, or instructions.

![Add Memory Dialog](/img/memories/settings-add-memory-dialog.png)

Click **Save** to store the memory.

## Step 3: Verify Memory Created

After saving, the memory appears in the list on the Settings page. You can see the memory content and a count of total memories at the bottom-right of the card.

![Memories List](/img/memories/settings-memories-list.png)

## Step 4: Test in Chat

Navigate to the chat interface and start a new conversation. Send a message that relates to something you stored in your memories, such as:

> What programming languages do I prefer?

The assistant will reference your stored memory and respond with personalized information — without you needing to repeat your preferences.

![Memory Recall](/img/memories/chat-memory-recall.png)

## Step 5: Managing Memories

You can edit or delete memories at any time from the Settings page:

-   **Edit**: Hover over a memory and click the **pencil icon** to open the editor dialog with the existing content pre-filled. Make your changes and click **Save**.
-   **Delete**: Hover over a memory and click the **trash icon**. A confirmation dialog will appear asking "Are you sure you want to delete this memory? This action cannot be undone." Click **Delete** to confirm or **Cancel** to keep the memory.

You can also use the **search bar** to filter memories by content when you have many stored.

:::tip Multiple Memories
You can create as many memories as you need. All of them are automatically injected into every conversation, so keep each memory focused on a single topic for best results.
:::

---

For API reference and programmatic access, see [Memories](./index.md).
