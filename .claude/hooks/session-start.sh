#!/bin/bash
set -euo pipefail

# Only run in remote environments (Claude Code on the web)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "🔧 Setting up git pre-commit hooks for version management..."

# Run the setup script to install git hooks
bash setup-hooks.sh

echo "✅ Session setup complete!"
