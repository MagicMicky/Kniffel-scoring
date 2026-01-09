# App Store Deployment Guide

This guide walks you through deploying your Kniffel PWA to the iOS App Store and Google Play Store.

## 📋 Prerequisites

### Accounts & Costs
- **Apple Developer Account**: $99/year (required for App Store)
- **Google Play Developer Account**: $25 one-time fee
- **Computer with Xcode** (Mac required for iOS builds)
- **Android Studio** (for Android builds)

### Technical Requirements
- Node.js 16+ installed
- CocoaPods installed (for iOS): `sudo gem install cocoapods`
- Xcode 14+ (Mac only, for iOS)
- Android Studio (for Android)

---

## 🎯 Recommended Approach: Capacitor

Capacitor converts your PWA into native iOS and Android apps while maintaining a single codebase.

### Why Capacitor?

✅ **Same codebase** - Your existing HTML/CSS/JS works as-is
✅ **Native features** - Access device APIs (haptics, motion, etc.)
✅ **Easy updates** - Change code once, deploy to both platforms
✅ **PWA first** - Can still deploy as PWA + native apps

---

## 🚀 Step-by-Step: Capacitor Setup

### 1. Install Capacitor

```bash
cd /path/to/Kniffel-scoring

# Install Capacitor
npm init -y  # Creates package.json if you don't have one
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init "Kniffel" "com.yourdomain.kniffel" --web-dir=.
```

**Configuration prompts:**
- **App name**: `Kniffel` (or your preferred name)
- **App ID**: `com.yourdomain.kniffel` (reverse domain, must be unique)
- **Web directory**: `.` (current directory, since your index.html is at root)

### 2. Add iOS and Android Platforms

```bash
# Add iOS (requires Mac)
npm install @capacitor/ios
npx cap add ios

# Add Android
npm install @capacitor/android
npx cap add android
```

This creates `ios/` and `android/` folders with native projects.

### 3. Configure capacitor.config.json

Edit the generated `capacitor.config.json`:

```json
{
  "appId": "com.yourdomain.kniffel",
  "appName": "Kniffel",
  "webDir": ".",
  "bundledWebRuntime": false,
  "server": {
    "cleartext": true
  },
  "ios": {
    "contentInset": "always"
  },
  "android": {
    "buildOptions": {
      "keystorePath": "release.keystore",
      "keystoreAlias": "kniffel"
    }
  }
}
```

### 4. Sync Your Web Code to Native Projects

```bash
npx cap sync
```

Run this **every time** you update your HTML/CSS/JS code.

### 5. Optional: Add Native Plugins

Your app already uses DeviceMotion. Consider enhancing with Capacitor plugins:

```bash
# Haptic feedback (vibration)
npm install @capacitor/haptics

# Device motion
npm install @capacitor/motion

# Share functionality
npm install @capacitor/share

# Sync after installing plugins
npx cap sync
```

**Update your JavaScript to use Capacitor APIs:**

```javascript
// Example: Replace navigator.vibrate with Capacitor Haptics
import { Haptics, ImpactStyle } from '@capacitor/haptics';

async function vibrate() {
  await Haptics.impact({ style: ImpactStyle.Medium });
}
```

---

## 📱 iOS App Store Deployment

### 1. Open iOS Project in Xcode

```bash
npx cap open ios
```

Xcode will launch with your project.

### 2. Configure App Settings in Xcode

**General Tab:**
- **Display Name**: `Kniffel`
- **Bundle Identifier**: `com.yourdomain.kniffel` (must match capacitor.config.json)
- **Version**: `1.0.0`
- **Build**: `1`

**Signing & Capabilities:**
- Select your Apple Developer Team
- Enable "Automatically manage signing"
- Add capabilities if needed (e.g., "Motion & Fitness" for shake detection)

### 3. Update Info.plist (Required Permissions)

In Xcode, find `Info.plist` and add:

```xml
<key>NSMotionUsageDescription</key>
<string>We use motion to detect shake gestures for rolling dice</string>

<key>UIRequiresFullScreen</key>
<true/>
```

### 4. Configure App Icons and Launch Screen

**App Icon:**
1. Prepare icon in sizes: 1024x1024 (App Store), 180x180, 120x120, 87x87, 80x80, 60x60, 58x58, 40x40, 29x29
2. In Xcode: `App/App/Assets.xcassets/AppIcon.appiconset/`
3. Drag icons into appropriate slots

**Launch Screen:**
- Edit `App/App/Base.lproj/LaunchScreen.storyboard`
- Or use your app icon centered on white background

### 5. Build and Archive

1. In Xcode: Select **"Any iOS Device"** as target
2. Menu: **Product → Archive**
3. Wait for build to complete (5-10 minutes first time)
4. **Organizer** window opens → Select your archive → Click **"Distribute App"**

### 6. Upload to App Store Connect

1. Choose **"App Store Connect"**
2. Click **"Upload"**
3. Wait for upload to complete

### 7. Submit for Review in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in metadata:
   - **Name**: Kniffel Scoring
   - **Primary Language**: English (or your preference)
   - **Bundle ID**: Select `com.yourdomain.kniffel`
   - **SKU**: `kniffel-001`
4. Add app description, screenshots, keywords, category (Games)
5. Select your uploaded build
6. Click **"Submit for Review"**

**Review Time:** 1-3 days typically

---

## 🤖 Google Play Store Deployment

### 1. Open Android Project in Android Studio

```bash
npx cap open android
```

### 2. Configure App Settings

**File: `android/app/build.gradle`**

```gradle
android {
    namespace "com.yourdomain.kniffel"
    compileSdk 34

    defaultConfig {
        applicationId "com.yourdomain.kniffel"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 3. Update App Name and Permissions

**File: `android/app/src/main/res/values/strings.xml`**

```xml
<resources>
    <string name="app_name">Kniffel</string>
    <string name="title_activity_main">Kniffel</string>
    <string name="package_name">com.yourdomain.kniffel</string>
</resources>
```

**File: `android/app/src/main/AndroidManifest.xml`**

Add permissions if needed:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. Generate App Icons

Use Android Studio's **Image Asset Studio**:
1. Right-click `res/` folder → **New → Image Asset**
2. Upload 512x512 icon
3. Android Studio generates all required sizes

### 5. Generate Signing Key

```bash
cd android/app

# Generate keystore (one-time setup)
keytool -genkey -v -keystore release.keystore -alias kniffel \
  -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Keystore password (SAVE THIS!)
# - Personal details
# - Key password (SAVE THIS!)
```

**Save the keystore file and passwords securely!**

### 6. Configure Signing in Gradle

**File: `android/app/build.gradle`**

```gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'kniffel'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 7. Build Release APK/AAB

```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

**AAB (Android App Bundle)** is preferred by Google Play.

### 8. Upload to Google Play Console

1. Go to https://play.google.com/console/
2. Click **"Create app"**
3. Fill in app details:
   - **App name**: Kniffel Scoring
   - **Default language**: English
   - **App or game**: Game
   - **Free or paid**: Free
4. Complete store listing:
   - Description
   - Screenshots (at least 2, recommended 1080x1920 or 1080x2400)
   - App icon (512x512)
   - Feature graphic (1024x500)
5. Go to **"Release → Production"** → **"Create new release"**
6. Upload your `app-release.aab` file
7. Add release notes
8. Click **"Review release"** → **"Start rollout to Production"**

**Review Time:** Hours to 1-2 days typically

---

## 🔄 Updating Your Apps

### Update Workflow

1. Make changes to your web code (`index.html`, etc.)
2. Sync to native projects: `npx cap sync`
3. Increment version in both platforms:
   - iOS: Xcode → General → Version/Build
   - Android: `android/app/build.gradle` → `versionCode` and `versionName`
4. Rebuild and resubmit to stores

### Version Numbering

- **versionName/Version**: `1.0.0` → `1.1.0` → `2.0.0` (user-facing)
- **versionCode/Build**: `1` → `2` → `3` (must increment with each release)

---

## 🎨 App Store Assets Checklist

### Required for iOS
- [ ] App icon: 1024x1024 PNG (no transparency, no rounded corners)
- [ ] Screenshots: 6.7" (1290x2796), 6.5" (1284x2778), 5.5" (1242x2208)
- [ ] App Store description (4000 chars max)
- [ ] Keywords (100 chars max)
- [ ] Privacy Policy URL (if collecting data)

### Required for Android
- [ ] App icon: 512x512 PNG
- [ ] Feature graphic: 1024x500 JPG/PNG
- [ ] Screenshots: At least 2 (1080x1920 or 1080x2400)
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Privacy Policy URL (if collecting data)

---

## 🛠️ Alternative: PWABuilder (Simpler but Limited)

If you want a **quick test** without setting up Capacitor:

1. Visit https://www.pwabuilder.com/
2. Enter your URL: `https://YOUR_USERNAME.github.io/Kniffel-scoring/`
3. Click **"Start"** → **"Package for Stores"**
4. Download iOS and Android packages
5. Follow PWABuilder's submission guides

**Limitations:**
- Less control over native features
- May need adjustments for App Store approval
- Limited access to device APIs

---

## 📊 Comparison: PWABuilder vs Capacitor

| Feature | PWABuilder | Capacitor |
|---------|-----------|-----------|
| **Setup Time** | 10 minutes | 1-2 hours |
| **Code Changes** | None | Minimal |
| **Native APIs** | Limited | Full access |
| **Customization** | Low | High |
| **Maintenance** | Easy | Moderate |
| **Best For** | Quick test | Production app |

---

## 💡 Recommendations for Your App

Given your Kniffel app's features (dice rolling, shake detection, haptics):

1. **Start with Capacitor** - Your app uses motion/haptic features that benefit from native APIs
2. **Use Capacitor Plugins**: `@capacitor/haptics`, `@capacitor/motion`
3. **Test on real devices** - iOS simulator doesn't support shake/haptics
4. **iOS first** - Higher barrier to entry, so validate there first
5. **Keep PWA** - Maintain GitHub Pages version for web users

---

## 🚨 Common Gotchas

### iOS App Store Rejection Reasons
- ❌ App crashes on launch → Test on real device, not just simulator
- ❌ Missing privacy descriptions → Add to Info.plist
- ❌ "App is just a website" → Add native features or polish UI
- ❌ Icons have transparency/rounded corners → Use flat 1024x1024 PNG

### Android Play Store Issues
- ❌ Wrong keystore signature → Use same keystore for all updates
- ❌ Target SDK too old → Keep `targetSdk` current (34+ in 2024)
- ❌ Missing privacy policy → Required if accessing device features

---

## 📞 Next Steps

1. **Decide approach**: Capacitor (recommended) or PWABuilder (quick test)
2. **Register developer accounts** (start with Google, $25 one-time)
3. **Prepare assets** (icons, screenshots, descriptions)
4. **Test locally** with Capacitor before submitting
5. **Submit to stores** and iterate based on feedback

---

## 🔗 Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **PWABuilder**: https://www.pwabuilder.com/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Google Play Console**: https://play.google.com/console/
- **iOS Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Android Design Guidelines**: https://developer.android.com/design

---

**Questions?** Start with Capacitor setup and reach out if you hit any blockers!
