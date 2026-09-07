#!/usr/bin/env bash

SESSION="spotidex"

# If the session already exists, attach to it
if tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux attach-session -t "$SESSION"
    exit 0
fi

# Get the project root (directory containing this script's parent)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ─────────────────────────────────────────────
# Tab 1: Development
# ─────────────────────────────────────────────

tmux new-session -d -s "$SESSION" -n "dev" -c "$PROJECT_ROOT"

# Left pane: Frontend
tmux send-keys -t "$SESSION:dev.0" \
    "cd frontend && pnpm run dev --host" C-m

# Right pane: Backend
tmux split-window -h -t "$SESSION:dev" -c "$PROJECT_ROOT"

tmux send-keys -t "$SESSION:dev.1" \
    "cd backend && uv run uvicorn app.main:app --reload" C-m

# ─────────────────────────────────────────────
# Tab 2: OpenCode
# ─────────────────────────────────────────────

tmux new-window -t "$SESSION" -n "opencode" -c "$PROJECT_ROOT"

tmux send-keys -t "$SESSION:opencode" \
    "opencode" C-m

# ─────────────────────────────────────────────
# Tab 3: Empty
# ─────────────────────────────────────────────

tmux new-window -t "$SESSION" -n "shell" -c "$PROJECT_ROOT"

# Start on first tab
tmux select-window -t "$SESSION:dev"

# Attach
tmux attach-session -t "$SESSION"