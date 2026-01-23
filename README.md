# Schnitzel - Your Travel Yahtzee Companion

A mobile-first Progressive Web App for scoring Yahtzee games. Works offline, installs to your home screen, and now includes a full **Play Mode** with virtual dice!

## Features

### Two Game Modes

**Score Mode** - Use your own physical dice and manually enter scores as you play.

**Play Mode** - Roll virtual dice right on your phone!
- Shake your phone to roll dice
- Tap dice to hold/release between rolls
- Automatic score calculation for all categories
- Follows official Yahtzee rules

### Core Features

- **Multi-player support** - 1-8 players per game
- **Player statistics** - Track games, wins, high scores, and Yahtzees per player
- **Game history** - View all completed games with rankings
- **Auto-save** - Games are automatically saved and can be resumed
- **Export/Import** - Backup and transfer your data between devices
- **Offline support** - Works without internet after first visit
- **Auto-updates** - Get notified when new versions are available

### Yahtzee Rules Implemented

- Upper section with 63+ bonus (35 points)
- All lower section combinations (3/4 of a kind, full house, straights, Yahtzee, chance)
- Yahtzee bonus (+100 for each additional Yahtzee)

## Installation

### iOS (Safari)
1. Open the app URL in Safari
2. Tap Share button → "Add to Home Screen"
3. Tap "Add"

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap "Add to Home Screen" banner or Menu → "Install app"
3. Tap "Install"

## Development

### Prerequisites
- Git
- Python 3 (for local server) or any static file server

### Setup

```bash
# Clone the repository
git clone https://github.com/MagicMicky/Kniffel-scoring.git
cd Kniffel-scoring

# Install git hooks (REQUIRED for version management)
bash setup-hooks.sh

# Start local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Project Structure

```
Kniffel-scoring/
├── index.html      # Main app (single-file SPA)
├── sw.js           # Service worker for offline/caching
├── manifest.json   # PWA manifest
├── version.json    # Auto-managed version info
├── setup-hooks.sh  # Git hooks installer
├── hooks/          # Git hook scripts
├── CLAUDE.md       # AI assistant instructions
└── icon-*.png      # App icons
```

### Git Hooks

The pre-commit hook automatically:
- Updates `version.json` with incremented version
- Bumps service worker cache version
- Ensures PWA users get update notifications

**Always run `bash setup-hooks.sh` before making changes!**

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Service Worker API
- localStorage API
- Web App Manifest
- DeviceMotion API (shake detection)
- GitHub Pages (hosting)

## License

MIT
