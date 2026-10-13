# Agents Directory

This directory contains all agent files for the agentfile.directory.

## Structure

Each agent is stored in a subdirectory with the following pattern:

```
agents/
└── {ownerId}/          # e.g., @letta-ai
    └── {agentKey}/     # e.g., loop
        ├── {agentKey}.af    # Agent file (JSON)
        └── {agentKey}.webp  # Agent avatar image (square)
```

## Example

```
agents/
└── @letta-ai/
    └── loop/
        ├── loop.af
        └── loop.webp
```

## Adding a New Agent

1. Create a directory: `agents/{ownerId}/{agentKey}/`
2. Add your `.af` file: `{agentKey}.af`
3. Add your avatar: `{agentKey}.webp` (square image)

## Notes

- The `ownerId` should include the `@` symbol (e.g., `@letta-ai`)
- The `agentKey` should be URL-safe (lowercase, hyphens okay)
- Avatar images should be square
- Agent files must be valid JSON matching the `.af` schema
