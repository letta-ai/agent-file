#!/bin/bash
# Sync agents from root to public for Next.js serving
rsync -av --delete agents/ public/agents/
echo "✅ Synced agents/ to public/agents/"
