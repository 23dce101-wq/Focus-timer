import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

export type SoundType = 'bell' | 'click' | 'gong' | 'beep' | 'water-drop' | 'none';

interface SoundOption {
  id: SoundType;
  name: string;
  description: string;
  emoji: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'bell', name: 'Soft Bell', description: 'Gentle chime sound', emoji: '🔔' },
  { id: 'click', name: 'Click', description: 'Simple click sound', emoji: '🖱️' },
  { id: 'gong', name: 'Gong', description: 'Deep resonant tone', emoji: '🎵' },
  { id: 'beep', name: 'Beep', description: 'Electronic beep', emoji: '⏰' },
  { id: 'water-drop', name: 'Water Drop', description: 'Calming water sound', emoji: '💧' },
  { id: 'none', name: 'Silent', description: 'No sound', emoji: '🔇' },
];

// Function to generate audio programmatically using Web Audio API
function generateSound(type: SoundType): string {
  if (type === 'none') return '';
  
  // Create AudioContext for generating sounds
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  
  let duration = 0.5; // Default duration in seconds
  let frequency = 440; // Default frequency in Hz
  
  switch (type) {
    case 'bell':
      duration = 1.0;
      frequency = 800;
      break;
    case 'click':
      duration = 0.1;
      frequency = 1000;
      break;
    case 'gong':
      duration = 2.0;
      frequency = 200;
      break;
    case 'beep':
      duration = 0.5;
      frequency = 880;
      break;
    case 'water-drop':
      duration = 0.8;
      frequency = 1200;
      break;
  }
  
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-3 * t); // Exponential decay
    
    if (type === 'bell') {
      // Bell sound with harmonics
      channelData[i] = envelope * (
        Math.sin(2 * Math.PI * frequency * t) * 0.5 +
        Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3 +
        Math.sin(2 * Math.PI * frequency * 3 * t) * 0.2
      );
    } else if (type === 'gong') {
      // Gong with low frequency and harmonics
      channelData[i] = envelope * (
        Math.sin(2 * Math.PI * frequency * t) * 0.6 +
        Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.4
      );
    } else if (type === 'water-drop') {
      // Water drop with frequency sweep
      const sweepFreq = frequency + (frequency * 2 * Math.exp(-5 * t));
      channelData[i] = envelope * Math.sin(2 * Math.PI * sweepFreq * t);
    } else {
      // Simple sine wave for click and beep
      channelData[i] = envelope * Math.sin(2 * Math.PI * frequency * t);
    }
  }
  
  // Convert AudioBuffer to WAV data URL
  const wavData = audioBufferToWav(buffer);
  const blob = new Blob([wavData], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const data = buffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const bufferLength = 44 + dataLength;
  
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }
  
  return arrayBuffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Cache for generated sounds
const SOUND_CACHE: Partial<Record<SoundType, string>> = {};

// Get or generate sound
function getSound(type: SoundType): string {
  if (type === 'none') return '';
  
  if (!SOUND_CACHE[type]) {
    try {
      SOUND_CACHE[type] = generateSound(type);
    } catch (error) {
      console.error('Failed to generate sound:', error);
      // Fallback to a simple beep using data URI
      SOUND_CACHE[type] = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleikBd6nk2ppzPQ1Rrd3eplw6D1i05eyiaT8YXLrp76xvRyBgvOvxsXhMMSRjvuvyt3pRMypnwez0u4FWNjJrxO71wYVbOTZvx+/3xIleQTl0yvD5x4xhRD15zfH6y5BkSEB/0fP7z5RoS0OE1PX80ZlsT0aI1/f91p1wUkmM2vn+2qF0VUyQ3fr/3qV4WE+U4Pv/46p7W1KY4/z/5q5+XlWc5v3/6bKBYVig6f7/7LWEZFuj7P//77iHZ1ym7///8ruKam+q8f//9b6NbXKt9P//+MGQcHWw9///+8SSc3iz+f///';
    }
  }
  
  return SOUND_CACHE[type] || '';
}

const STORAGE_KEY = 'timerflow_sound_settings';

interface SoundSettings {
  soundType: SoundType;
  volume: number;
  enabled: boolean;
}

export function SoundSelector() {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to defaults
      }
    }
    return { soundType: 'bell', volume: 70, enabled: true };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Dispatch custom event to notify other components of the change
    window.dispatchEvent(new Event('soundSettingsChanged'));
  }, [settings]);

  const playPreview = (soundType: SoundType) => {
    if (soundType === 'none' || !settings.enabled) return;
    
    try {
      const soundUrl = getSound(soundType);
      if (!soundUrl) return;
      
      const audio = new Audio(soundUrl);
      audio.volume = settings.volume / 100;
      audio.play().catch((error) => {
        console.error('Could not play sound preview:', error);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  };

  const handleSoundChange = (soundType: SoundType) => {
    setSettings((prev) => ({ ...prev, soundType }));
    playPreview(soundType);
  };

  const handleVolumeChange = (values: number[]) => {
    setSettings((prev) => ({ ...prev, volume: values[0] }));
  };

  const toggleSound = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {settings.enabled && settings.soundType !== 'none' ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
          <span className="sr-only">Sound settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sound Settings</DialogTitle>
          <DialogDescription>
            Choose an alert sound and adjust the volume for timer notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Sound */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="text-base font-medium">
              Enable Sound Alerts
            </Label>
            <Button
              id="sound-enabled"
              variant={settings.enabled ? 'default' : 'outline'}
              size="sm"
              onClick={toggleSound}
            >
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          {/* Sound Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Alert Sound</Label>
            <RadioGroup
              value={settings.soundType}
              onValueChange={(value) => handleSoundChange(value as SoundType)}
              className="space-y-2"
              disabled={!settings.enabled}
            >
              {SOUND_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </Label>
                  </div>
                  {option.id !== 'none' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playPreview(option.id)}
                      disabled={!settings.enabled}
                      className="ml-2"
                    >
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Preview {option.name}</span>
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-base font-medium">
                Volume
              </Label>
              <span className="text-sm text-muted-foreground">{settings.volume}%</span>
            </div>
            <Slider
              id="volume"
              value={[settings.volume]}
              onValueChange={handleVolumeChange}
              min={0}
              max={100}
              step={5}
              disabled={!settings.enabled || settings.soundType === 'none'}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export hook to access sound settings
export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to defaults
      }
    }
    return { soundType: 'bell', volume: 70, enabled: true };
  });

  // Listen for localStorage changes from SoundSelector component
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch {
          // Keep current settings if parse fails
        }
      }
    };

    // Listen for storage events (changes in other tabs/components)
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('soundSettingsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soundSettingsChanged', handleStorageChange);
    };
  }, []);

  const playSound = () => {
    try {
      // Get latest settings from localStorage for most up-to-date values
      const saved = localStorage.getItem(STORAGE_KEY);
      let currentSettings = settings;
      
      if (saved) {
        try {
          currentSettings = JSON.parse(saved);
        } catch {
          // Use state settings as fallback
        }
      }

      if (!currentSettings.enabled || currentSettings.soundType === 'none') {
        console.log('🔇 Sound is disabled or set to none');
        return;
      }
      
      console.log(`🔊 Playing alert sound: ${currentSettings.soundType} at ${currentSettings.volume}% volume (repeating for 5 seconds)`);
      
      const soundUrl = getSound(currentSettings.soundType);
      if (!soundUrl) {
        console.error('No sound URL generated');
        return;
      }
      
      // Play sound repeatedly for 5 seconds
      const ALERT_DURATION = 5000; // 5 seconds
      let playCount = 0;
      const maxPlays = Math.ceil(ALERT_DURATION / 1000); // At least 5 plays
      const audioInstances: HTMLAudioElement[] = [];
      
      const playSoundInstance = () => {
        if (playCount >= maxPlays) {
          console.log(`✅ Alert sound completed (played ${playCount} times over 5 seconds)`);
          return;
        }
        
        const audio = new Audio(soundUrl);
        audio.volume = currentSettings.volume / 100;
        audioInstances.push(audio);
        
        audio.addEventListener('ended', () => {
          playCount++;
          // Continue playing if we haven't reached 5 seconds yet
          if (playCount < maxPlays) {
            setTimeout(playSoundInstance, 100); // Small gap between repetitions
          } else {
            console.log(`✅ Alert sound finished (${playCount} repetitions)`);
          }
        });
        
        audio.play().then(() => {
          if (playCount === 0) {
            console.log('✅ Alert sound started (will repeat for 5 seconds)');
          }
        }).catch((error) => {
          console.error('❌ Could not play alert sound:', error);
          // Try fallback with a simple oscillator
          if (playCount === 0) {
            tryOscillatorFallback(currentSettings, ALERT_DURATION);
          }
        });
      };
      
      // Start the alert sequence
      playSoundInstance();
      
      // Store cleanup function globally in case user wants to stop it
      (window as any).stopTimerAlert = () => {
        console.log('🛑 Stopping alert sound');
        audioInstances.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
        audioInstances.length = 0;
      };
      
    } catch (error) {
      console.error('❌ Error in playSound:', error);
    }
  };

  // Fallback using Web Audio API Oscillator (always works)
  const tryOscillatorFallback = (currentSettings: SoundSettings, duration: number = 500) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const startTime = audioContext.currentTime;
      const endTime = startTime + (duration / 1000);
      
      // Create repeating beeps for the duration
      let currentTime = startTime;
      let beepCount = 0;
      
      while (currentTime < endTime) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // 800 Hz
        oscillator.type = 'sine';
        
        const beepDuration = 0.3; // 300ms per beep
        const gapDuration = 0.2; // 200ms gap
        
        gainNode.gain.setValueAtTime(currentSettings.volume / 100, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + beepDuration);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + beepDuration);
        
        currentTime += beepDuration + gapDuration;
        beepCount++;
      }
      
      console.log(`✅ Played fallback oscillator sound (${beepCount} beeps over ${duration}ms)`);
    } catch (error) {
      console.error('❌ Fallback sound also failed:', error);
    }
  };

  return { settings, playSound };
}
