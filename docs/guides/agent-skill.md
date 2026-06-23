---
title: Agent skill
description: Link to the reusable agent skill repository.
---

# Agent skill

A reusable agent skill is available here:

https://github.com/haskou/ddd-engineer-skills

The skill repository is separate from this package. This keeps the runtime library focused on code, tests, and documentation, while the agent skill can evolve independently.

## Use cases

The skill can help coding agents with repetitive maintenance tasks around this style of value object:

- creating a new value object with validation and tests
- reviewing public exports
- checking serialization behavior
- checking error behavior
- keeping examples consistent with the package API

## Repository split

| Repository | Purpose |
| --- | --- |
| `haskou/value-objects` | Runtime package and documentation. |
| `haskou/ddd-engineer-skills` | Reusable agent instructions and workflows. |
