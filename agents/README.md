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
3. Add your avatar: `{agentKey}.webp` (square image, will be cropped to 1:1)
4. The build process automatically syncs `agents/` → `public/agents/`
5. Build will automatically discover and generate pages for all agents

### Automated Sync

The sync from `agents/` to `public/agents/` happens automatically:

- **Local**: `npm run build` runs `npm run sync-agents` first
- **Vercel**: The build command includes the sync step
- **Manual**: `npm run sync-agents` or `./sync-agents.sh`

The sync uses `rsync` with fallback to `cp` for compatibility.

## Notes

- The `ownerId` should include the `@` symbol (e.g., `@letta-ai`)
- The `agentKey` should be URL-safe (lowercase, hyphens okay)
- Avatar images are displayed as squares with `object-cover` cropping
- Agent files must be valid JSON matching the `.af` schema
