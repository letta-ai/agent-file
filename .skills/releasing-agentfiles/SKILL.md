---
name: releasing-agentfiles
description: Contributes an agent to the letta-ai/agent-file directory. Use when setting up a new agent (.af file) for publication, including directory creation, avatar processing, file placement, and structure verification. Triggers on requests to release, publish, or contribute an agent file.
---

# Releasing Agent Files

Publish a contributed agent to the `letta-ai/agent-file` repository.

## Required Inputs

Before starting, confirm the user has:

1. **An exported `.af` file** — the agent file to publish
2. **An avatar image** — any common format (PNG, JPG, WebP); does not need to be square
3. **Owner ID** — GitHub handle with `@` prefix (e.g. `@letta-ai`, `@cpfiffer`)
4. **Agent key** — lowercase, hyphen-separated, URL-safe name (e.g. `loop`, `lettabot-builder`)

## Workflow

### 1. Create the agent directory

```
agents/@{owner}/{agent-key}/
```

### 2. Copy and rename the `.af` file

Place it as `{agent-key}.af` in the agent directory. The filename must match the agent key exactly.

### 3. Process the avatar image

Run the bundled script to pad the image to square and convert to webp:

```bash
.skills/releasing-agentfiles/scripts/process-avatar.sh <input-image> agents/@{owner}/{agent-key}/{agent-key}.webp
```

The script:
- Detects dimensions and pads the shorter side using the top-left pixel as background color
- Skips padding if already square
- Converts to webp (quality 90)
- Requires ImageMagick (`brew install imagemagick`)

If the image has a non-uniform background or the top-left pixel isn't representative, manually specify a background color with ImageMagick instead:

```bash
magick input.png -gravity center -background "#1a1a2e" -extent 500x500 -quality 90 output.webp
```

### 4. Add a README (optional but recommended)

Create `README.md` in the agent directory. Good content includes:
- What the agent does
- What makes it special
- How it was trained
- Example interactions
- Tools or integrations it uses

Ask the agent to write its own README if convenient.

### 5. Verify the structure

The final directory must match this layout exactly:

```
agents/@{owner}/{agent-key}/
├── {agent-key}.af        # Required
├── {agent-key}.webp      # Required, square
└── README.md             # Optional
```

Check:
- [ ] Filenames match the agent key exactly
- [ ] `.webp` is square (verify with `sips -g pixelHeight -g pixelWidth` or `magick identify`)
- [ ] `.af` is valid JSON
- [ ] No sensitive data (API keys, personal info) in the `.af` file — see `agents/CONTRIBUTING.md` for sanitization guidance

### 6. Clean up

Remove any working files from the repo root (exported `.af` files, source images, temp files). Only the files inside `agents/@{owner}/{agent-key}/` should remain.

### 7. Commit

```bash
git add agents/@{owner}/{agent-key}/
git commit -m "feat: add @{owner}/{agent-key}"
```

## Reference

For full contribution guidelines including privacy review, sanitization, and PR process, see `agents/CONTRIBUTING.md`.
