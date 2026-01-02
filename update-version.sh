#!/bin/bash
# Auto-update version.json and service worker cache

# Get current commit hash (short)
COMMIT=$(git rev-parse --short HEAD)

# Get current date in ISO format
DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Read current version from version.json
CURRENT_VERSION=$(grep -oP '"version":\s*"\K[^"]+' version.json)

# Parse version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

# Update version.json
cat > version.json << EOF
{
  "version": "$NEW_VERSION",
  "commit": "$COMMIT",
  "updated": "$DATE"
}
EOF

# Get current cache version from sw.js
CURRENT_CACHE=$(grep -oP "CACHE_NAME = 'kniffel-v\K\d+" sw.js)
NEW_CACHE=$((CURRENT_CACHE + 1))

# Update service worker cache name
sed -i "s/const CACHE_NAME = 'kniffel-v[0-9]*'/const CACHE_NAME = 'kniffel-v$NEW_CACHE'/" sw.js

echo "✅ Updated to version $NEW_VERSION (commit: $COMMIT)"
echo "✅ Service worker cache bumped to kniffel-v$NEW_CACHE"
echo ""
echo "Don't forget to commit these changes:"
echo "  git add version.json sw.js"
echo "  git commit -m \"Bump version to $NEW_VERSION\""
