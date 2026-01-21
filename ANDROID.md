# 📱 Android App - Build & Release Guide

This document explains how to build and release the Kniffel app as an Android application using GitHub Actions.

## 🎯 Overview

The Kniffel PWA is automatically packaged as an Android app using:
- **Bubblewrap** - Google's official CLI for packaging PWAs as Trusted Web Activities (TWA)
- **GitHub Actions** - Automated builds on every commit
- **GitHub Artifacts** - Download built APK/AAB files

## 🏗️ How It Works

### What is a Trusted Web Activity (TWA)?

A TWA is a way to package your PWA as an Android app that:
- ✅ Runs your web app in fullscreen without browser UI
- ✅ Appears as a native app in the Play Store
- ✅ Uses the same storage as your PWA (seamless data sync)
- ✅ Gets automatic updates when you deploy to GitHub Pages
- ✅ Passes all PWA features to the Android app (offline, icons, etc.)

### Build Process

1. **Trigger**: Push to `main` branch or any `claude/**` branch
2. **Setup**: GitHub Actions installs Node.js, Java, and Bubblewrap CLI
3. **Keystore**: Generates a signing keystore (demo/dev mode)
4. **Generate**: Bubblewrap creates Android project from `twa-manifest.json`
5. **Build**: Gradle builds both AAB (for Play Store) and APK (for testing)
6. **Upload**: Artifacts are uploaded and available for download

## 📦 Downloading Built Apps

### From GitHub Actions

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. Click on the latest workflow run
4. Scroll down to **"Artifacts"** section
5. Download:
   - `android-app-bundle` - Contains the `.aab` file for Google Play Console
   - `android-apk` - Contains the `.apk` file for direct installation

### File Types

| File | Purpose | Use Case |
|------|---------|----------|
| `.aab` (App Bundle) | **Upload to Google Play Console** | Required for Play Store release |
| `.apk` (APK) | **Direct installation** | Testing on your device |

## 🚀 Uploading to Google Play Console

### First-Time Setup

1. **Create Google Play Developer Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay one-time $25 registration fee
   - Complete account setup

2. **Create New App**
   - Click "Create app"
   - App name: **Kniffel**
   - Language: Select primary language
   - App type: **App**
   - Free or paid: **Free** (or your choice)
   - Accept declarations
   - Click "Create app"

3. **Complete Store Listing**
   - App details (description, screenshots, icon)
   - Content rating
   - Target audience
   - Privacy policy (required)
   - App category

### Upload App Bundle

1. **Go to "Release" → "Production"**
2. Click **"Create new release"**
3. **Upload the AAB file** you downloaded from GitHub Actions
4. Add release notes (e.g., "Initial release" or version changelog)
5. Click **"Review release"**
6. Click **"Start rollout to Production"**

### App Signing

**Important:** On first upload, Google Play will ask about app signing:
- Choose **"Google Play App Signing"** (recommended)
- Google manages your signing keys securely
- You can still use your upload key

## 🔐 Production Signing (Important!)

The workflow **automatically supports both demo and production keystores**:
- 🔧 **No secrets configured** → Uses auto-generated demo keystore (for testing)
- 🔐 **Secrets configured** → Uses your production keystore automatically

### Option 1: Use Your Own Production Keystore (via GitHub Secrets)

**The workflow is already configured to use secrets automatically!** Just add them:

#### Step 1: Generate a Production Keystore

```bash
keytool -genkey -v \
  -keystore kniffel-release.keystore \
  -alias kniffel \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**⚠️ Important:**
- Remember your passwords! You'll need them forever.
- Keep the keystore file safe - if you lose it, you can't update your app.
- Use a strong alias like "kniffel" or "kniffel-release" (not "android").

#### Step 2: Encode Keystore to Base64

```bash
# On Linux/macOS:
base64 kniffel-release.keystore > keystore.b64

# On Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("kniffel-release.keystore")) > keystore.b64
```

#### Step 3: Add Secrets to GitHub

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these **4 secrets** (exact names required):

| Secret Name | Value | Example |
|-------------|-------|---------|
| `ANDROID_KEYSTORE_BASE64` | Contents of `keystore.b64` file | `MIIJpwIBAzCC...` (very long) |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password | `MyStorePass123!` |
| `ANDROID_KEY_PASSWORD` | Your key password | `MyKeyPass456!` |
| `ANDROID_KEY_ALIAS` | Your key alias | `kniffel` |

**🔒 Security Features:**
- Secrets are encrypted and never exposed in logs
- Keystore is decoded in memory only
- Passwords are masked in all output
- Files are cleaned up after build

#### Step 4: That's It!

The workflow **automatically detects** the secrets and uses them. No workflow changes needed!

Next push to `main` or `claude/**` will show:
```
📦 Using production keystore from GitHub Secrets
✅ Production keystore decoded successfully
```

### Option 2: Use Google Play App Signing (Easiest)

**Recommended for beginners!** Let Google manage your signing keys:

1. Use the demo keystore (no secrets needed)
2. Upload your first AAB to Play Console
3. Choose **"Let Google manage and protect your app signing key"**
4. Google re-signs with their secure key
5. You keep using the same upload key for all future updates

**Benefits:**
- ✅ No need to manage production keystore locally
- ✅ No risk of losing your signing key
- ✅ Google handles security
- ✅ Can reset upload key if compromised

**Drawback:**
- ❌ APKs for direct installation won't be signed with Google's key (only AAB from Play Store)

## 🧪 Testing the APK

### Install on Android Device

1. Download the `.apk` file from GitHub Actions
2. Transfer to your Android device
3. Enable "Install from unknown sources" in Settings
4. Tap the APK file to install
5. Open the app!

### Verify TWA Behavior

The app should:
- ✅ Open fullscreen (no browser address bar)
- ✅ Show your PWA icon and splash screen
- ✅ Work offline (after first launch)
- ✅ Share storage with web version (if you installed PWA before)

## 🔄 Updating the App

### For Development

1. Make changes to your PWA code
2. Commit and push to `main` or `claude/**` branch
3. GitHub Actions automatically builds new version
4. Download updated APK/AAB from Actions artifacts

### For Production (Play Store)

1. **Update version in `twa-manifest.json`**:
   ```json
   {
     "appVersionName": "1.0.1",
     "appVersionCode": 2
   }
   ```
   - `appVersionCode` must increment by 1 (integer)
   - `appVersionName` is display version (e.g., "1.0.1")

2. Commit and push changes
3. Download new AAB from GitHub Actions
4. Upload to Play Console → Create new release
5. Submit for review

**Note:** Users with your app installed will automatically get updates from Play Store!

## 📋 Configuration Reference

### `twa-manifest.json`

Key fields you might want to customize:

```json
{
  "packageId": "com.magicmicky.kniffel",  // Must be unique
  "host": "magicmicky.github.io",         // Your GitHub Pages domain
  "startUrl": "/Kniffel-scoring/",        // Your app path
  "name": "Kniffel",                      // App name
  "launcherName": "Kniffel",              // Home screen name
  "themeColor": "#1a1512",                // Status bar color
  "backgroundColor": "#1a1512",           // Splash screen bg
  "appVersionName": "1.0.0",              // Display version
  "appVersionCode": 1,                    // Integer version (increment each release)
  "minSdkVersion": 23,                    // Android 6.0+
  "targetSdkVersion": 33                  // Android 13
}
```

### Digital Asset Links

For your TWA to work seamlessly, you need to verify domain ownership:

1. **Create `assetlinks.json`** in your repository:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.magicmicky.kniffel",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
     }
   }]
   ```

2. **Get SHA256 fingerprint**:
   ```bash
   keytool -list -v -keystore /path/to/keystore -alias android
   ```

3. **Deploy** to `https://magicmicky.github.io/Kniffel-scoring/.well-known/assetlinks.json`

4. **Verify** at [Asset Links Tester](https://developers.google.com/digital-asset-links/tools/generator)

## 🛠️ Manual Build (Local Development)

If you want to build locally instead of using GitHub Actions:

### Prerequisites

```bash
# Install Node.js 18+
# Install Java JDK 17

# Install Bubblewrap
npm install -g @bubblewrap/cli

# Install Android SDK (or Android Studio)
```

### Build Steps

```bash
# Initialize project (first time only)
bubblewrap init --manifest=twa-manifest.json

# Or update existing project
bubblewrap update --manifest=twa-manifest.json

# Build AAB
cd android
./gradlew bundleRelease

# Build APK
./gradlew assembleRelease
```

Output files:
- AAB: `android/app/build/outputs/bundle/release/*.aab`
- APK: `android/app/build/outputs/apk/release/*.apk`

## 🐛 Troubleshooting

### Build Fails on GitHub Actions

**Check workflow logs:**
1. Go to Actions tab
2. Click failed workflow
3. Expand failed step
4. Look for error messages

**Common issues:**
- ❌ Invalid `twa-manifest.json` syntax
- ❌ Incorrect startUrl or host
- ❌ Network issues downloading dependencies
- ❌ Bubblewrap interactive prompt (should be fixed by providing JDK path via printf)
- ❌ Missing Android SDK (now installed via android-actions/setup-android)

### Keystore Issues

**"Failed to decode keystore" message:**
- Check that `ANDROID_KEYSTORE_BASE64` is valid base64
- Verify you copied the entire contents of the `.b64` file
- Make sure there are no extra newlines or spaces

**Build succeeds but shows "Using demo keystore":**
- Verify all 4 secrets are added: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`, `ANDROID_KEY_ALIAS`
- Check secret names exactly match (case-sensitive)
- Secrets must be "Repository secrets" not "Environment secrets"

**How to verify secrets are being used:**
Look for this in the build logs:
```
📦 Using production keystore from GitHub Secrets
✅ Production keystore decoded successfully
```

If you see:
```
🔧 No production keystore found, using demo keystore
```
Then secrets are not configured or not accessible.

**Checking if keystore is valid:**
```bash
# List contents of your keystore
keytool -list -v -keystore kniffel-release.keystore

# Verify alias exists
keytool -list -alias kniffel -keystore kniffel-release.keystore
```

### APK Won't Install

- Make sure "Install from unknown sources" is enabled
- Check if you have enough storage space
- Try uninstalling old version first

### App Shows Browser UI

Your TWA isn't verified. You need:
1. Correct `assetlinks.json` deployed
2. Matching SHA256 fingerprint
3. Matching package ID

### App Doesn't Update

- PWA updates are separate from app updates
- App structure updates require new APK/AAB
- Content updates (HTML/CSS/JS) happen via PWA service worker

## 📚 Resources

- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Trusted Web Activities Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Google Play Console](https://play.google.com/console)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)

## 🎉 Quick Start Checklist

- [x] ✅ GitHub Actions workflow created
- [x] ✅ TWA manifest configured
- [ ] 🔄 Push to trigger first build
- [ ] 📥 Download AAB from Actions artifacts
- [ ] 🏪 Create Google Play Console account
- [ ] 📤 Upload AAB to Play Console
- [ ] 🔐 Set up production keystore with GitHub Secrets
- [ ] 🔗 Configure Digital Asset Links
- [ ] 🚀 Publish to Play Store!

---

**Last Updated:** 2026-01-21
