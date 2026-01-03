# Kniffel Scoring PWA - Documentation

> ⚠️ **CRITICAL - DO THIS FIRST BEFORE ANY WORK:**
> ```bash
> bash setup-hooks.sh
> ```
> This installs git hooks for automatic version updates. Without this, PWA users won't get update notifications!

This document provides comprehensive instructions for managing, updating, and maintaining your Kniffel (Yahtzee) scoring Progressive Web App.

## 📱 Table of Contents

1. [Game Modes](#game-modes)
2. [GitHub Pages Setup](#github-pages-setup)
3. [Installing the PWA](#installing-the-pwa)
4. [Updating the PWA](#updating-the-pwa)
5. [Export & Import Data](#export--import-data)
6. [Data Safety & localStorage](#data-safety--localstorage)
7. [Troubleshooting](#troubleshooting)
8. [Development Workflow](#development-workflow)

---

## 🎮 Game Modes

The app supports two modes, selectable on the setup screen:

### Score Mode (📝)
Use your own physical dice. Manually tap score categories to enter values. Best for playing with real dice at a table.

### Play Mode (🎲)
Roll virtual dice on your phone! Features:
- **Shake to roll** - Shake your phone to roll the dice (requires motion permission on iOS)
- **Tap to hold** - Tap any die to hold/release it between rolls
- **3 rolls per turn** - Standard Yahtzee rules
- **Auto-calculation** - Scores are calculated automatically based on dice
- **Haptic feedback** - Vibration on roll and Yahtzee
- **Yahtzee detection** - Special notification and bonus handling

**Technical Notes:**
- Uses DeviceMotion API for shake detection
- iOS 13+ requires user permission (requested on first tap)
- Falls back to roll button if motion unavailable
- Dice state is saved/restored with game state

---

## 🌐 GitHub Pages Setup

### Initial Setup

1. **Go to your repository settings:**
   - Navigate to https://github.com/YOUR_USERNAME/Kniffel-scoring
   - Click on **Settings** tab
   - Click on **Pages** in the left sidebar

2. **Configure GitHub Pages:**
   - Under "Source", select **Deploy from a branch**
   - Under "Branch", select **main**
   - Select folder: **/ (root)**
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will build and deploy your site (takes 1-2 minutes)
   - Your app will be available at: `https://YOUR_USERNAME.github.io/Kniffel-scoring/`

### Deploying Updates

After merging changes to the `main` branch:

1. GitHub Pages automatically rebuilds (1-2 minutes)
2. The new version will be live at your GitHub Pages URL
3. Users will see an update notification within 60 seconds of opening the app

---

## 📲 Installing the PWA

### On iPhone (iOS Safari)

1. Open **Safari** and navigate to your GitHub Pages URL
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (default: "Kniffel")
5. Tap **"Add"**
6. The app icon will appear on your home screen!

**Features on iOS:**
- ✅ Runs fullscreen (no Safari UI)
- ✅ Works offline after first visit
- ✅ Appears like a native app
- ✅ Saves to device home screen

### On Android (Chrome)

1. Open **Chrome** and navigate to your GitHub Pages URL
2. You'll see a banner: **"Add Kniffel to Home screen"**
   - Tap **"Add"** → **"Install"**
3. **OR** tap the **⋮ menu** → **"Add to Home screen"** or **"Install app"**
4. Confirm by tapping **"Add"** or **"Install"**
5. The app icon will appear on your home screen!

**Features on Android:**
- ✅ Runs fullscreen (no browser UI)
- ✅ Works offline after first visit
- ✅ Appears in app drawer
- ✅ Can be managed like any app

### On Android (Firefox/Samsung Internet)

1. Open the browser and navigate to your GitHub Pages URL
2. Tap the **⋮ menu**
3. Select **"Install"** or **"Add to Home screen"**
4. Confirm installation

---

## 🔄 Updating the PWA

### How Updates Work

The app automatically checks for updates **every 60 seconds** when open. When a new version is detected:

1. A banner appears at the top: **"🎉 Update Available! Your data is safe."**
2. Two options are presented:
   - **"Update Now"** - Reloads the app immediately with the new version
   - **"Later"** - Dismisses the banner; update will apply on next app open

### Your Data is ALWAYS Safe

**Important:** Updates ONLY affect the app code (HTML/CSS/JavaScript). Your data is stored separately in localStorage and is NEVER deleted during updates.

✅ **What updates affect:**
- App interface and features
- Bug fixes
- New functionality

❌ **What updates DON'T affect:**
- Your saved players
- Game history
- Current game in progress
- Any scores or statistics

### Force Update (if automatic update doesn't work)

#### iPhone (iOS)

1. Close the PWA completely (swipe up from app switcher)
2. Open **Safari** browser (not the PWA)
3. Go to your GitHub Pages URL
4. Pull down to refresh
5. Wait for update banner to appear
6. Close Safari and reopen the PWA

**If that doesn't work:**
1. Delete the PWA from home screen (long-press → Remove App)
2. Open Safari and go to your URL
3. Re-install: Share → Add to Home Screen

#### Android

1. Open **Chrome** browser (not the PWA)
2. Go to your GitHub Pages URL
3. Pull down to refresh
4. Or: Menu (⋮) → Settings → Site settings → Clear & reset
5. Return to the PWA

**If that doesn't work:**
1. Settings → Apps → [Kniffel PWA]
2. Tap "Storage" → **"Clear cache"** (NOT "Clear data"!)
3. Open the PWA again

---

## 💾 Export & Import Data

### Export Your Data

**When to Export:**
- Before switching devices
- As a backup
- To share with another device
- Before clearing browser data

**How to Export:**

1. Open the app
2. On the setup screen, tap **"📥 Export"**
3. A file named `yahtzee-data-YYYY-MM-DD.json` will download
4. Save this file somewhere safe (cloud storage, email it to yourself, etc.)

**What's Included:**
- All players
- Complete game history
- Statistics

### Import Your Data

**How to Import:**

1. Open the app
2. On the setup screen, tap **"📤 Import"**
3. Select your previously exported `.json` file
4. The app will merge the data:
   - Avoids duplicates (by ID)
   - Preserves existing data
   - Shows count of imported players and games

**Import is Safe:**
- Existing data is NOT overwritten
- Duplicates are automatically skipped
- Both old and new data coexist

### Cross-Device Compatibility

The export/import feature uses a standardized format, ensuring compatibility across:
- Different devices
- Different browsers
- Different versions of the app
- Multiple installations

**Use Case Example:**
1. Play games on your phone → Export
2. Import on tablet → Continue playing
3. Export from tablet
4. Import back to phone → All history merged!

---

## 🔒 Data Safety & localStorage

### What is localStorage?

localStorage is browser storage that:
- Persists even when app is closed
- Is NOT affected by service worker updates
- Is NOT deleted when you clear cache
- Stays until you explicitly clear "Site Data" or uninstall

### What Data is Stored?

| Key | Content |
|-----|---------|
| `yahtzeeP` | All saved players (name, ID) |
| `yahtzeeH` | Complete game history |
| `yahtzeeSaved` | Current in-progress game (auto-saved) |

### When Data COULD Be Lost

⚠️ **Data is ONLY lost if:**
1. You clear browser **"Site Data"** or **"Storage"** (not just cache)
2. You uninstall the PWA AND clear browser data
3. Browser storage is full and browser evicts old data (rare)

✅ **Data is SAFE when:**
1. Updating the app
2. Clearing cache
3. Restarting phone
4. Closing/reopening app
5. Installing updates from GitHub Pages

### Best Practices

1. **Export regularly** - Weekly or after important games
2. **Before clearing browser data** - Always export first
3. **Before switching devices** - Export from old, import to new
4. **Cloud backup** - Save export files to Google Drive / iCloud

---

## 🔧 Troubleshooting

### App Won't Update

**Solution 1: Force Refresh**
- iOS: Close PWA → Open in Safari → Refresh → Reopen PWA
- Android: Open in Chrome → Refresh → Reopen PWA

**Solution 2: Clear Cache (keeps data)**
- iOS: Safari → Settings → Clear History and Website Data → Reinstall PWA
- Android: Settings → Apps → Kniffel → Storage → Clear Cache

**Solution 3: Unregister Service Worker**

Open the PWA, then run in browser console:

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
}).then(() => location.reload());
```

Your data will still be there after reload!

### Lost Players or History

**If data appears missing:**

1. Check if you're on the correct device/browser
2. Try closing and reopening the app
3. Check if you have an export file to restore from

**If data is truly lost:**

1. Import from your most recent export file
2. If no export exists, data cannot be recovered
3. Prevention: Export regularly!

### App Won't Install

**iOS:**
- Use Safari (not Chrome or Firefox)
- Make sure you're on the actual website URL
- Try restarting Safari

**Android:**
- Make sure Chrome is up to date
- Try opening in Incognito mode first
- Check if "Install apps" is enabled in Chrome settings

### Export Button Not Working

1. Check browser permissions for downloads
2. Try a different browser
3. Check if popup blocker is preventing download

### Import Shows "Invalid File Format"

- Make sure file is a `.json` export from this app
- Don't edit the export file manually
- Re-export if file appears corrupted

---

## 👨‍💻 Development Workflow

### Initial Setup (Run Once Per Session)

**Install Git Hooks for Automatic Versioning**

Before making any changes, install the git hooks:

```bash
bash setup-hooks.sh
```

This installs a pre-commit hook that automatically:
- Updates `version.json` with version `1.0.X` (where X = commit count)
- Increments the service worker cache name (`kniffel-v5` → `v6` → `v7`, etc.)
- Includes these files in your commit automatically

**You'll see this output when committing:**
```
✅ Auto-updated version to 1.0.20 (cache: kniffel-v7)
```

This ensures users always get update notifications when you deploy new versions!

### For Making Changes

**1. Create a New Branch**

Always create a new branch for each feature or fix:

```bash
git checkout main
git pull origin main
git checkout -b claude/your-feature-name-xxxxx
```

**2. Make Your Changes**

Edit the files as needed:
- `index.html` - Main app code
- `sw.js` - Service worker (caching, offline)
- `manifest.json` - PWA metadata
- `CLAUDE.md` - Documentation (this file)

**3. Test Locally**

```bash
# Simple local server
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

**4. Commit and Push**

```bash
git add -A
git commit -m "Descriptive commit message"
git push -u origin claude/your-feature-name-xxxxx
```

**5. Create Pull Request**

After pushing, GitHub will show a link to create a PR:
```
Create a pull request for 'claude/your-feature-name-xxxxx' on GitHub by visiting:
https://github.com/YOUR_USERNAME/Kniffel-scoring/pull/new/claude/your-feature-name-xxxxx
```

Click the link or go to your repository and click **"Compare & pull request"**.

**6. Merge to Main**

1. Review the changes in the PR
2. Click **"Merge pull request"**
3. Click **"Confirm merge"**
4. Delete the branch (optional but recommended)

**7. Deploy to GitHub Pages**

GitHub Pages automatically rebuilds within 1-2 minutes after merging to `main`.

### Automatic Version Management

**Version updates are now fully automated!**

When you commit changes to `index.html`, `manifest.json`, or `sw.js`, the pre-commit hook automatically:

1. **Updates `version.json`** with the next version number based on commit count
2. **Increments service worker cache** in `sw.js` (e.g., `kniffel-v5` → `kniffel-v6`)
3. **Adds these files** to your commit

**You don't need to manually update versions anymore!**

The hook output shows what was updated:
```
✅ Auto-updated version to 1.0.20 (cache: kniffel-v7)
```

**Note:** If you ever need to manually update the cache version, edit `sw.js`:
```javascript
const CACHE_NAME = 'kniffel-v7';  // Change this number
```

### Testing PWA Features

**Test service worker:**
```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(reg => console.log(reg));
```

**Test cache:**
```javascript
// In browser console
caches.keys().then(keys => console.log(keys));
```

**Test localStorage:**
```javascript
// In browser console
console.log(localStorage.getItem('yahtzeeP'));
console.log(localStorage.getItem('yahtzeeH'));
```

---

## 📞 Support & Feedback

If you encounter issues or have suggestions:

1. Check this documentation first
2. Try the troubleshooting steps
3. Export your data before attempting fixes
4. For bugs: Open an issue on GitHub

---

## 📄 License & Credits

Built with ❤️ as a Progressive Web App for Yahtzee/Kniffel scoring.

**Tech Stack:**
- Vanilla JavaScript
- Service Worker API
- localStorage API
- Web App Manifest
- GitHub Pages

---

**Last Updated:** 2026-01-03
**Version:** 2.2 (added Game Mode with virtual dice)
