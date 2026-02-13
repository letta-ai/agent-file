#!/usr/bin/env bash
# process-avatar.sh — Pad an image to square and convert to webp
#
# Usage:
#   ./process-avatar.sh <input-image> <output.webp>
#
# Examples:
#   ./process-avatar.sh lettabot.png agents/@letta-ai/lettabot-builder/lettabot-builder.webp
#   ./process-avatar.sh avatar.jpg agents/@cpfiffer/my-agent/my-agent.webp
#
# Requirements: ImageMagick 7+ (magick) or 6 (convert)
#
# Behavior:
#   - Detects image dimensions
#   - If not square, pads shorter side using the top-left pixel color as background
#   - Converts to webp format with quality 90

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <input-image> <output.webp>"
  echo ""
  echo "Pads an image to square (using edge background color) and converts to webp."
  exit 1
fi

INPUT="$1"
OUTPUT="$2"

if [ ! -f "$INPUT" ]; then
  echo "Error: Input file not found: $INPUT"
  exit 1
fi

# Create output directory if needed
OUTPUT_DIR="$(dirname "$OUTPUT")"
if [ -n "$OUTPUT_DIR" ] && [ ! -d "$OUTPUT_DIR" ]; then
  mkdir -p "$OUTPUT_DIR"
fi

# Prefer magick (IMv7) over convert (IMv6)
if command -v magick &>/dev/null; then
  IM="magick"
elif command -v convert &>/dev/null; then
  IM="convert"
else
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

# Get dimensions
DIMS=$($IM identify -format "%wx%h" "$INPUT" 2>/dev/null)
WIDTH=${DIMS%x*}
HEIGHT=${DIMS#*x}

echo "Input: $INPUT (${WIDTH}x${HEIGHT})"

if [ "$WIDTH" -eq "$HEIGHT" ]; then
  echo "Image is already square. Converting to webp..."
  $IM "$INPUT" -quality 90 "$OUTPUT"
else
  # Sample background color from top-left pixel
  BG_COLOR=$($IM "$INPUT" -format '%[pixel:p{0,0}]' info: 2>/dev/null)
  SIZE=$(( WIDTH > HEIGHT ? WIDTH : HEIGHT ))
  echo "Padding to ${SIZE}x${SIZE} (background: $BG_COLOR)..."
  $IM "$INPUT" -gravity center -background "$BG_COLOR" -extent "${SIZE}x${SIZE}" -quality 90 "$OUTPUT"
fi

# Verify output
OUT_DIMS=$($IM identify -format "%wx%h" "$OUTPUT" 2>/dev/null)
echo "Output: $OUTPUT ($OUT_DIMS)"
echo "Done."
