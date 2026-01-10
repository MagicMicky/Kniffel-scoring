#!/bin/bash
# Install git hooks for automatic version management

HOOK_SOURCE="hooks/pre-commit"
HOOK_TARGET=".git/hooks/pre-commit"

if [ ! -d ".git" ]; then
  echo "❌ Error: Not in a git repository"
  exit 1
fi

if [ ! -f "$HOOK_SOURCE" ]; then
  echo "❌ Error: Hook source file not found: $HOOK_SOURCE"
  exit 1
fi

# Copy the hook
cp "$HOOK_SOURCE" "$HOOK_TARGET"
chmod +x "$HOOK_TARGET"

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now automatically:"
echo "  - Update version.json with commit count (1.0.X format)"
echo "  - Increment service worker cache version"
echo "  - Include these changes in your commits"
echo ""
echo "This happens automatically when you commit changes to:"
echo "  - Any .js files (app code, services, state)"
echo "  - Any .css files (styles, components)"
echo "  - Any .html files (index.html)"
echo "  - Any .json files (manifest.json, version.json)"
