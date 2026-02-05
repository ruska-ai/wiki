---
title: "Interactive Tours Developer Guide"
slug: /tutorials/interactive-tours
sidebar_position: 2
---

# Interactive Tours Developer Guide

[![Join Discord](https://img.shields.io/badge/Join-Discord-purple)](https://discord.com/invite/QRfjg4YNzU)
[![View API Docs](https://img.shields.io/badge/View-API%20Docs-blue)](https://chat.ruska.ai/api)
[![Follow Social](https://img.shields.io/badge/Follow-Social-black)](https://ruska.ai/socials)

Orchestra uses [Intro.js](https://introjs.com/) to provide guided onboarding tours that help users discover new features. This guide explains how to create, test, and maintain tours using the `useIntroTour` hook.

## Overview

Interactive tours are step-by-step walkthroughs that highlight UI elements and explain workflows. They are:

- **Dismissible** — users can exit at any time by clicking the overlay or pressing Esc
- **Persistent** — dismissal state is stored in `localStorage` so the tour only auto-shows once
- **Re-triggerable** — a "Show Tour" button lets users replay the tour on demand
- **Composable** — steps can be conditionally added based on component state

The AGENTS.md onboarding tour on the agent create page is the reference implementation.

## Prerequisites

The `intro.js` package is already installed in the frontend. The `useIntroTour` hook is located at:

```
frontend/src/hooks/useIntroTour.ts
```

No additional setup is needed.

## Creating a New Tour

### Step 1: Add `data-tour` Attributes to Target Elements

Mark the elements you want to highlight with `data-tour` attributes:

```tsx
<div data-tour="my-feature-guidance">
  <p>This element will be highlighted in the tour.</p>
</div>

<button data-tour="my-feature-action">Click me</button>
```

For elements in other components that you cannot modify, use existing `aria-label` attributes as CSS selectors:

```tsx
// Target an element in a sibling/parent component
element: "[aria-label='Switch to editor view']"
```

:::tip
Prefer `data-tour` attributes for elements within your own component. Use `[aria-label='...']` selectors for cross-component targets that already have accessible labels.
:::

### Step 2: Define Tour Steps

Import the types and hook, then define your steps array:

```tsx
import {
  useIntroTour,
  type IntroTourStep,
} from "@/hooks/useIntroTour";

const tourSteps = useMemo<IntroTourStep[]>(() => {
  const steps: IntroTourStep[] = [
    {
      element: "[data-tour='my-feature-guidance']",
      title: "Welcome to My Feature",
      intro: "This is a brief explanation of what this feature does.",
      position: "bottom",
    },
    {
      element: "[data-tour='my-feature-action']",
      title: "Take Action",
      intro: "Click this button to perform the action.",
      position: "right",
    },
  ];

  // Conditionally add steps based on state
  if (someCondition) {
    steps.splice(1, 0, {
      element: "[data-tour='conditional-step']",
      title: "Extra Step",
      intro: "This step only appears when a condition is met.",
      position: "bottom",
    });
  }

  return steps;
}, [someCondition]);
```

Each step has the following properties:

| Property   | Type                      | Required | Description                              |
|------------|---------------------------|----------|------------------------------------------|
| `element`  | `string \| HTMLElement`   | No       | CSS selector or element ref to highlight |
| `intro`    | `string`                  | Yes      | Tooltip body text                        |
| `title`    | `string`                  | No       | Tooltip header text                      |
| `position` | `TooltipPosition`         | No       | Tooltip placement (default: `"bottom"`)  |

Available positions: `"floating"`, `"top"`, `"bottom"`, `"left"`, `"right"`, `"top-right-aligned"`, `"top-left-aligned"`, `"top-middle-aligned"`, `"bottom-right-aligned"`, `"bottom-left-aligned"`, `"bottom-middle-aligned"`.

:::info
If `element` is omitted, the step displays as a centered floating tooltip — useful for welcome or summary steps.
:::

### Step 3: Initialize the Hook

```tsx
const { startTour, isComplete, resetTour } = useIntroTour(
  "my-feature-onboarding",  // unique tour ID
  tourSteps,
  { autoStart: true }       // auto-show on first visit
);
```

**Parameters:**

| Parameter | Type                  | Description                                      |
|-----------|-----------------------|--------------------------------------------------|
| `tourId`  | `string`              | Unique identifier — used as the localStorage key |
| `steps`   | `IntroTourStep[]`     | Array of tour steps                              |
| `options` | `UseIntroTourOptions` | Optional configuration (see below)               |

**Options:**

| Option              | Type      | Default | Description                                  |
|---------------------|-----------|---------|----------------------------------------------|
| `autoStart`         | `boolean` | `false` | Auto-start on mount if not previously dismissed |
| `exitOnOverlayClick`| `boolean` | `true`  | Allow dismissal by clicking the overlay      |
| `showProgress`      | `boolean` | `true`  | Show step progress bar                       |
| `showBullets`       | `boolean` | `false` | Show navigation bullet points                |

**Return values:**

| Value       | Type         | Description                                    |
|-------------|--------------|------------------------------------------------|
| `startTour` | `() => void` | Manually start the tour                        |
| `isComplete`| `boolean`    | Whether the tour has been completed/dismissed   |
| `resetTour` | `() => void` | Clear dismissal state and allow re-triggering  |

### Step 4: Add a Re-trigger Button

Add a button or link so users can replay the tour:

```tsx
import { HelpCircle } from "lucide-react";

<button
  type="button"
  onClick={startTour}
  className="inline-flex items-center text-sm text-muted-foreground hover:underline"
>
  <HelpCircle className="mr-1 h-3.5 w-3.5" />
  Show Tour
</button>
```

## localStorage Key Conventions

Tour dismissal state is stored with the key pattern:

```
orchestra:tour:{tourId}:dismissed
```

For example, the AGENTS.md onboarding tour uses:

```
orchestra:tour:agents-md-onboarding:dismissed
```

**Naming conventions for `tourId`:**

- Use kebab-case: `my-feature-onboarding`
- Be descriptive: `agents-md-onboarding`, not `tour-1`
- Scope to the feature: `thread-sharing-tour`, `mcp-setup-tour`

## Design Guidelines

### Content

- **Be concise** — each step should be 1–2 sentences maximum
- **Be action-oriented** — tell users what to do, not what they're looking at
- **Use titles** — short descriptive headers help users scan steps quickly
- **Progress logically** — order steps to match the natural user workflow

### Accessibility

- Tour elements are keyboard navigable (Tab, Enter, Esc)
- Ensure highlighted elements have sufficient contrast
- Keep tooltip text readable at default font size
- `exitOnOverlayClick: true` (the default) ensures users are never trapped

### Behavior

- Tours auto-start **once** per user (controlled via localStorage)
- After dismissal (complete or exit), the tour never auto-shows again
- Users can always replay via the "Show Tour" button
- `resetTour()` clears the localStorage key for development/debugging

## Testing Tours

### Mocking in Component Tests

When a component uses `useIntroTour` with `autoStart: true`, the Intro.js overlay renders to the DOM on mount. This adds extra elements that break queries like `getByText()`. **Always mock the hook in tests:**

```tsx
vi.mock("@/hooks/useIntroTour", () => ({
  useIntroTour: () => ({
    startTour: vi.fn(),
    isComplete: false,
    resetTour: vi.fn(),
  }),
}));
```

Place `vi.mock()` calls **before** importing the component under test.

### Manual Testing Checklist

When verifying a tour in the browser:

1. **First visit** — tour auto-starts and walks through all steps
2. **Dismiss mid-tour** — click overlay or press Esc; tour should not reappear on page reload
3. **Re-trigger** — click the "Show Tour" button; tour replays from step 1
4. **Element targeting** — each step correctly highlights the intended element
5. **Conditional steps** — verify dynamic steps appear/disappear based on state
6. **Responsive behavior** — tooltips should not overflow the viewport on smaller screens

### Resetting Tour State in Development

To reset a tour's dismissal state during development, run this in the browser console:

```js
localStorage.removeItem("orchestra:tour:my-feature-onboarding:dismissed");
```

Or call `resetTour()` from a development-only button.

## Reference: AGENTS.md Onboarding Tour

The AGENTS.md tour in `agent-create-form.tsx` demonstrates all patterns described above:

- **5 steps** targeting guidance note, editor toggle, file creation, file editor, and save button
- **Conditional step** for legacy migration (spliced in when agent has legacy instructions)
- **Cross-component targeting** using `[aria-label='...']` selectors
- **Same-component targeting** using `data-tour` attributes
- **Re-trigger link** with `HelpCircle` icon next to the guidance note
- **Auto-start** on first visit to the create page

See `frontend/src/components/forms/agents/agent-create-form.tsx` for the full implementation.
