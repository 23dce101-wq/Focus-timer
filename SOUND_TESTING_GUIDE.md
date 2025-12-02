# 🔊 Sound System Testing Guide

## Overview
The timer now has a fully functional sound alert system that plays when the timer completes.

## Features Implemented

### ✅ Sound Generation
- **6 Different Sounds**: Bell, Click, Gong, Beep, Water Drop, Silent
- **Web Audio API**: Sounds are generated programmatically for better quality
- **Fallback System**: If audio fails, oscillator beep plays as backup

### ✅ Sound Controls
- **Volume Control**: 0-100% with 5% increments
- **Enable/Disable**: Toggle all sound alerts on/off
- **Preview**: Test each sound before selecting
- **Real-time Sync**: Settings sync instantly across the app

### ✅ Timer Integration
- **Countdown Mode**: Plays sound repeatedly for 5 seconds when timer reaches 00:00
- **Pomodoro Mode**: Plays sound repeatedly for 5 seconds at end of each work/break session
- **Stopwatch Mode**: No sound (runs indefinitely)
- **Extended Alert**: Sound repeats for minimum 5 seconds so you won't miss it!

## How to Test

### 1. Test Sound Selection
1. Click the **🔊 Sound icon** in the header
2. Try different sounds using the **▶ Play button**
3. Adjust the **volume slider**
4. Select your preferred sound
5. Click outside to close the dialog

### 2. Test with Countdown Timer
1. Set a **short timer** (e.g., 5 seconds)
2. Make sure **sound is enabled** (blue "Enabled" button)
3. Click **Start** and wait for timer to complete
4. **Sound should play** when timer reaches 00:00
5. Check browser console for logs:
   - `🔊 Playing sound: [sound-name] at [volume]% volume`
   - `✅ Sound playback started successfully`
   - `✅ Sound finished playing`

### 3. Test with Pomodoro Timer
1. Switch to **Pomodoro tab**
2. Use the **1 min preset** for quick testing
3. Click **Start** and wait
4. **Sound plays** when work session completes
5. **Sound plays again** when break starts

### 4. Test Preset Buttons
1. Click any **preset button** (1min, 5min, 10min, etc.)
2. Click **Start**
3. Wait for countdown to complete
4. Verify sound plays at 00:00

## Troubleshooting

### No Sound Playing?
1. **Check Sound Settings**
   - Click the sound icon in header
   - Verify "Enabled" button is blue
   - Verify not set to "Silent"
   - Test volume is above 0%

2. **Check Browser Console** (F12)
   - Look for sound-related logs
   - If you see `🔇 Sound is disabled`, enable it in settings
   - If you see `❌ Could not play alert sound`, check browser permissions

3. **Browser Permissions**
   - Some browsers block autoplay until user interaction
   - Click anywhere on the page first
   - Try clicking the timer controls

4. **Volume/Mute**
   - Check system volume is not muted
   - Check browser tab is not muted (right-click tab)
   - Try increasing volume in sound settings

### Still Not Working?
- **Refresh the page** (Ctrl+R or Cmd+R)
- **Clear localStorage**: Open console and run:
  ```javascript
  localStorage.removeItem('timerflow_sound_settings');
  location.reload();
  ```
- **Try different browser**: Chrome, Firefox, Edge, Safari

## Console Debugging

Open browser console (F12) to see detailed sound logs:

### Successful Playback
```
Timer completed! Playing sound...
🔊 Playing alert sound: bell at 70% volume (repeating for 5 seconds)
✅ Alert sound started (will repeat for 5 seconds)
✅ Alert sound finished (5 repetitions)
✅ Alert sound completed (played 5 times over 5 seconds)
```

### Sound Disabled
```
Timer completed! Playing sound...
🔇 Sound is disabled or set to none
```

### Error
```
❌ Could not play alert sound: [error details]
✅ Played fallback oscillator sound
```

## Technical Details

### Sound Settings Storage
- **Location**: `localStorage.timerflow_sound_settings`
- **Format**: JSON
- **Keys**: `soundType`, `volume`, `enabled`

### Sound Generation
- Uses **Web Audio API** for high-quality sounds
- Each sound has unique characteristics:
  - **Bell**: 800 Hz with harmonics, 1 second
  - **Click**: 1000 Hz short burst, 0.1 seconds
  - **Gong**: 200 Hz deep tone, 2 seconds
  - **Beep**: 880 Hz standard beep, 0.5 seconds
  - **Water Drop**: 1200 Hz with frequency sweep, 0.8 seconds

### Fallback System
If audio file fails to play, system automatically:
1. Tries oscillator-based beep sound
2. Logs detailed error information
3. Ensures user gets some notification

## Quick Test Command

Run this in browser console to test sound immediately:
```javascript
const sound = new Audio();
sound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleikBd6nk2ppzPQ1Rrd3eplw6D1i05eyiaT8YXLrp76xvRyBgvOvxsXhMMSRjvuvyt3pRMypnwez0u4FWNjJrxO71wYVbOTZvx+/3xIleQTl0yvD5x4xhRD15zfH6y5BkSEB/0fP7z5RoS0OE1PX80ZlsT0aI1/f91p1wUkmM2vn+2qF0VUyQ3fr/3qV4WE+U4Pv/46p7W1KY4/z/5q5+XlWc5v3/6bKBYVig6f7/7LWEZFuj7P//77iHZ1ym7///8ruKam+q8f//9b6NbXKt9P//+MGQcHWw9///+8SSc3iz+f///';
sound.volume = 0.7;
sound.play();
```

### Stop Alert Sound Early

If the alert sound is too long, you can stop it manually:
```javascript
// Run this in console to stop the alert
window.stopTimerAlert();
```

## Success Criteria

✅ Sound plays when countdown timer completes  
✅ Sound plays when Pomodoro phase completes  
✅ Sound respects enabled/disabled setting  
✅ Sound respects volume setting (0-100%)  
✅ Preview button plays selected sound  
✅ Settings persist after page refresh  
✅ Console shows detailed logging  
✅ Fallback sound works if primary fails  

---

**Need Help?** Check the browser console (F12) for detailed logs about sound playback.
