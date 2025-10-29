#!/bin/bash
# Start Next.js dev server with proper settings

cd "$(dirname "$0")"
export PORT=3000
npm run dev -- --hostname localhost

