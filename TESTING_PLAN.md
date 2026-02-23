# Testing Plan: Capacitor PR #8194 (--https Live Reload)

## Overview
Testing the new `--https` flag for `cap run` command that enables live reload over HTTPS.

**PR:** https://github.com/ionic-team/capacitor/pull/8194
**Feature:** Adds `--https` flag to allow live reload over secure connections
**Testing Approach:** Remote HTTPS via ngrok (least effort)

---

## Prerequisites

- [ ] Node.js and npm installed
- [ ] Capacitor CLI with PR #8194 changes installed
- [ ] Android Studio (for Android testing)
- [ ] Xcode (for iOS testing)
- [ ] ngrok account (free tier is sufficient)
- [ ] Android device/emulator configured
- [ ] iOS simulator/device configured

---

## Setup Phase

### 1. Install ngrok

```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# OR download from https://ngrok.com/download

# Authenticate (sign up at ngrok.com for free auth token)
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 2. Verify Project Setup

```bash
# Check Capacitor version
npx cap --version

# Sync native projects
npx cap sync
```

---

## Testing Scenario: ngrok + HTTPS Live Reload

### Step 1: Start Development Server

```bash
# Start your Vite dev server (default port 5173)
npm run dev
```

Keep this terminal running. Note the port (default: 5173).

### Step 2: Start ngrok Tunnel

In a new terminal:

```bash
# Create HTTPS tunnel to your dev server
ngrok http 5173
```

**Expected output:**
```
Forwarding  https://abcd-1234-5678.ngrok-free.app -> http://localhost:5173
```

**Important:** Copy the `https://` URL (e.g., `https://abcd-1234-5678.ngrok-free.app`)

### Step 3A: Test on Android

In a new terminal:

```bash
# Run with live reload using ngrok URL and --https flag
npx cap run android -l --host=abcd-1234-5678.ngrok-free.app --https --port=443
```

**Expected behavior:**
- App builds and deploys to Android device/emulator
- Console shows: `[info] App running with live reload listing for: https://abcd-1234-5678.ngrok-free.app:443`
- App loads your web content
- WebView connects via HTTPS

**Test live reload:**
1. Make a visible change in your React code (e.g., change text in `src/pages/Home.tsx`)
2. Save the file
3. Observe: App should automatically reload and show the change

### Step 3B: Test on iOS

In a new terminal:

```bash
# Run with live reload using ngrok URL and --https flag
npx cap run ios -l --host=abcd-1234-5678.ngrok-free.app --https --port=443
```

**Expected behavior:**
- App builds and launches in iOS simulator
- Console shows: `[info] App running with live reload listing for: https://abcd-1234-5678.ngrok-free.app:443`
- App loads your web content via HTTPS
- WebView connects securely

**Test live reload:**
1. Make a visible change in your React code
2. Save the file
3. Observe: App should automatically reload and show the change

---

## Verification Checklist

### Android Testing
- [ ] App starts successfully with `--https` flag
- [ ] Console shows HTTPS URL (not HTTP)
- [ ] App loads web content without SSL errors
- [ ] Live reload works: code changes trigger app refresh
- [ ] No certificate warnings in WebView
- [ ] Console logs show secure connection
- [ ] App runs on both emulator and physical device

### iOS Testing
- [ ] App starts successfully with `--https` flag
- [ ] Console shows HTTPS URL (not HTTP)
- [ ] App loads web content without SSL errors
- [ ] Live reload works: code changes trigger app refresh
- [ ] No certificate warnings in WebView
- [ ] Console logs show secure connection
- [ ] App runs on both simulator and physical device

### Cross-Platform Consistency
- [ ] Same ngrok URL works for both platforms
- [ ] Live reload speed is comparable on both platforms
- [ ] No platform-specific SSL issues
- [ ] Feature parity between Android and iOS

---

## Test Cases to Execute

### Basic Functionality
1. **Start with --https flag**
   - Command: `npx cap run [platform] -l --host=YOUR_NGROK_HOST --https --port=443`
   - Expected: App starts, connects via HTTPS

2. **Without --https flag (baseline)**
   - Command: `npx cap run [platform] -l --host=YOUR_NGROK_HOST --port=443`
   - Expected: App tries HTTP (may fail or show different behavior)

3. **Live reload verification**
   - Change: Update a text element in the UI
   - Expected: App refreshes automatically, shows new content

### Edge Cases
4. **App stays in background**
   - Action: Put app in background, make code change
   - Expected: Live reload triggers when app returns to foreground

5. **Network interruption**
   - Action: Disable/enable device WiFi briefly
   - Expected: App reconnects to HTTPS server

6. **Multiple code changes in quick succession**
   - Action: Make several rapid edits
   - Expected: App reloads appropriately without crashing

---

## Troubleshooting

### Issue: ngrok connection refused
**Solution:** Ensure your dev server is running on the port you specified to ngrok

### Issue: App shows white screen
**Solution:**
- Check ngrok URL is accessible in a browser
- Verify `--host` matches your ngrok domain (without https://)
- Check Capacitor config points to correct server

### Issue: Live reload not working
**Solution:**
- Check WebSocket connection in browser dev tools
- Verify ngrok tunnel is still active
- Restart ngrok and update the command with new URL

### Issue: "SSL certificate problem" on Android
**Solution:**
- ngrok provides valid SSL certificates, this shouldn't occur
- If it does, check Android system date/time is correct

### Issue: iOS simulator not loading
**Solution:**
- Clean build: `npx cap sync ios` then try again
- Check simulator network connectivity
- Verify ngrok URL loads in Safari on simulator

---

## Alternative Testing: Local Network (Optional)

If you want to quickly test without ngrok:

```bash
# Get your local IP
ipconfig getifaddr en0   # macOS
# or hostname -I         # Linux

# Run with local IP (HTTP only - for comparison)
npx cap run android -l --host=192.168.1.XXX
```

This won't test the `--https` feature but provides a baseline comparison.

---

## Notes

- **ngrok free tier:** URLs change each time you restart ngrok. Update your `cap run` command accordingly.
- **ngrok performance:** Slight latency added due to tunneling, but acceptable for testing.
- **Port 443:** Standard HTTPS port, ngrok handles this automatically.
- **Certificate validity:** ngrok provides legitimate SSL certificates, no self-signed cert issues.
- **Mobile data:** Testing can also be done with device on mobile data (not just WiFi) since ngrok is publicly accessible.

---

## Success Criteria

The feature works correctly if:
1. ✅ Both Android and iOS apps start with `--https` flag
2. ✅ Console shows HTTPS URL instead of HTTP
3. ✅ Apps load content without certificate errors
4. ✅ Live reload functions seamlessly on both platforms
5. ✅ No security warnings in WebView
6. ✅ Feature works with external HTTPS servers (ngrok validation)

---

## Reporting Issues

If you find bugs during testing, report with:
- Platform (Android/iOS version)
- Command used
- Expected vs actual behavior
- Console output/logs
- Screenshot of any errors
