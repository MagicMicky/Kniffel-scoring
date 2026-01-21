#!/usr/bin/env node

/**
 * Generate Android TWA project structure without interactive prompts
 * This script creates all the necessary files for an Android Trusted Web Activity
 */

const fs = require('fs');
const path = require('path');

// Read configuration from twa-manifest.json
const twaManifest = JSON.parse(fs.readFileSync('twa-manifest.json', 'utf8'));

const projectDir = 'android';

// Create directory structure
const dirs = [
  'android',
  'android/app',
  'android/app/src',
  'android/app/src/main',
  'android/app/src/main/java/com/magicmicky/kniffel',
  'android/app/src/main/res',
  'android/app/src/main/res/values',
  'android/app/src/main/res/drawable',
  'android/app/src/main/res/xml',
  'android/app/src/main/res/mipmap-hdpi',
  'android/app/src/main/res/mipmap-mdpi',
  'android/app/src/main/res/mipmap-xhdpi',
  'android/app/src/main/res/mipmap-xxhdpi',
  'android/app/src/main/res/mipmap-xxxhdpi',
  'android/gradle',
  'android/gradle/wrapper'
];

console.log('Creating directory structure...');
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate build.gradle (project level)
const rootBuildGradle = `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.1'
        classpath 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;

// Generate build.gradle (app level)
const appBuildGradle = `apply plugin: 'com.android.application'

android {
    compileSdk 33

    defaultConfig {
        applicationId "${twaManifest.packageId}"
        minSdkVersion ${twaManifest.minSdkVersion}
        targetSdkVersion ${twaManifest.targetSdkVersion}
        versionCode ${twaManifest.appVersionCode}
        versionName "${twaManifest.appVersionName}"

        manifestPlaceholders = [
            hostName: "${twaManifest.host}",
            defaultUrl: "https://${twaManifest.host}${twaManifest.startUrl}",
            launcherName: "${twaManifest.launcherName}",
            appName: "${twaManifest.name}",
            themeColor: "${twaManifest.themeColor}",
            navigationColor: "${twaManifest.navigationColor}",
            backgroundColor: "${twaManifest.backgroundColor}",
            enableNotifications: ${twaManifest.enableNotifications}
        ]
    }

    buildTypes {
        release {
            minifyEnabled true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
`;

// Generate AndroidManifest.xml
const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="\${appName}"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Translucent.NoTitleBar"
        tools:ignore="GoogleAppIndexingWarning">

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="\${launcherName}"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="\${defaultUrl}" />

            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />

            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/navigationColor" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_IMAGE_DRAWABLE"
                android:resource="@drawable/splash" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_BACKGROUND_COLOR"
                android:resource="@color/backgroundColor" />

            <meta-data
                android:name="android.support.customtabs.trusted.SPLASH_SCREEN_FADE_OUT_DURATION"
                android:value="${twaManifest.splashScreenFadeOutDuration}" />

            <meta-data
                android:name="android.support.customtabs.trusted.FILE_PROVIDER_AUTHORITY"
                android:value="${twaManifest.packageId}.fileprovider" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="\${hostName}" />
            </intent-filter>
        </activity>

        <activity android:name="com.google.androidbrowserhelper.trusted.FocusActivity" />

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${twaManifest.packageId}.fileprovider"
            android:grantUriPermissions="true"
            android:exported="false">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/filepaths" />
        </provider>
    </application>
</manifest>
`;

// Generate colors.xml
const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${twaManifest.themeColor}</color>
    <color name="navigationColor">${twaManifest.navigationColor}</color>
    <color name="backgroundColor">${twaManifest.backgroundColor}</color>
</resources>
`;

// Generate strings.xml
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${twaManifest.name}</string>
    <string name="launcher_name">${twaManifest.launcherName}</string>
</resources>
`;

// Generate gradle.properties
const gradleProperties = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`;

// Generate settings.gradle
const settingsGradle = `include ':app'
rootProject.name = "${twaManifest.name}"
`;

// Generate gradlew wrapper files
const gradleWrapperProperties = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

// Generate splash screen drawable
const splashXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:opacity="opaque">
    <item android:drawable="@color/backgroundColor" />
</layer-list>
`;

// Generate file provider paths
const filePathsXml = `<?xml version="1.0" encoding="utf-8"?>
<paths>
    <cache-path name="my_cache" path="." />
</paths>
`;

// Generate assetlinks.json content for Digital Asset Links
const assetlinksJson = JSON.stringify([
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": twaManifest.packageId,
      "sha256_cert_fingerprints": [
        "PLACEHOLDER_FINGERPRINT_TO_BE_REPLACED"
      ]
    }
  }
], null, 2);

// Write all files
console.log('Generating build files...');
fs.writeFileSync('android/build.gradle', rootBuildGradle);
fs.writeFileSync('android/app/build.gradle', appBuildGradle);
fs.writeFileSync('android/app/src/main/AndroidManifest.xml', androidManifest);
fs.writeFileSync('android/app/src/main/res/values/colors.xml', colorsXml);
fs.writeFileSync('android/app/src/main/res/values/strings.xml', stringsXml);
fs.writeFileSync('android/app/src/main/res/drawable/splash.xml', splashXml);
fs.writeFileSync('android/app/src/main/res/xml/filepaths.xml', filePathsXml);
fs.writeFileSync('android/gradle.properties', gradleProperties);
fs.writeFileSync('android/settings.gradle', settingsGradle);
fs.writeFileSync('android/gradle/wrapper/gradle-wrapper.properties', gradleWrapperProperties);
fs.writeFileSync('android/assetlinks.json', assetlinksJson);

console.log('✅ Android project structure generated successfully!');
console.log('Project created at: ./android/');
console.log('');
console.log('Note: Remember to:');
console.log('1. Replace PLACEHOLDER_FINGERPRINT in assetlinks.json with your actual signing key fingerprint');
console.log('2. Deploy assetlinks.json to https://' + twaManifest.host + '/.well-known/assetlinks.json');
