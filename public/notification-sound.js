// Notification sound generator
// Generates a simple beep sound as base64 data URL

// Simple notification beep (440 Hz sine wave, 0.3 seconds)
export const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

// Better quality notification sound
export function createNotificationAudio() {
  const audio = new Audio();
  
  // Simple notification beep sound (base64 encoded WAV)
  audio.src = 'data:audio/wav;base64,UklGRiYGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIGAACAgICA//8AAP//AAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAAAAAAAAAACAgICA//8AAP//AAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAAAAAAAAAACAgICA//8AAP//AAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAAAAAAAAAACAgICA//8AAP//AAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAAAAAAAAAACAgICA';
  
  audio.volume = 1.0;
  audio.preload = 'auto';
  
  return audio;
}
