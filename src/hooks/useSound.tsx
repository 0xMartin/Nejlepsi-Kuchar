import { useCallback, useRef, useEffect, useState } from 'react';

// Zvukové frekvence a délky pro různé efekty
const SOUNDS = {
  select: { frequencies: [440, 550], duration: 0.1, type: 'sine' as OscillatorType },
  success: { frequencies: [523, 659, 784], duration: 0.15, type: 'sine' as OscillatorType },
  perfect: { frequencies: [523, 659, 784, 1047], duration: 0.2, type: 'sine' as OscillatorType },
  whoosh: { frequencies: [200, 100], duration: 0.15, type: 'sawtooth' as OscillatorType },
  pop: { frequencies: [600, 400], duration: 0.08, type: 'square' as OscillatorType },
  fanfare: { frequencies: [523, 659, 784, 1047, 1319], duration: 0.25, type: 'sine' as OscillatorType },
} as const;

type SoundName = keyof typeof SOUNDS;

const SOUND_ENABLED_KEY = 'nejlepsi-kuchar-sound';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(SOUND_ENABLED_KEY);
    return saved !== 'false'; // Defaultně zapnuto
  });

  // Inicializace AudioContext (lazy)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Přehrát sekvenci tónů
  const playSound = useCallback((name: SoundName) => {
    if (!soundEnabled) return;
    
    try {
      const ctx = getAudioContext();
      const sound = SOUNDS[name];
      
      // Pro suspended context
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      
      let startTime = ctx.currentTime;
      
      sound.frequencies.forEach((freq) => {
        const oscillator = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        oscillator.type = sound.type;
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + sound.duration);
        
        oscillator.connect(noteGain);
        noteGain.connect(gainNode);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + sound.duration);
        
        startTime += sound.duration * 0.7; // Překryv tónů
      });
    } catch (e) {
      console.warn('Zvuk se nepodařilo přehrát:', e);
    }
  }, [soundEnabled, getAudioContext]);

  // Zapnutí/vypnutí zvuku
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem(SOUND_ENABLED_KEY, String(newValue));
      return newValue;
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playSound,
    soundEnabled,
    toggleSound,
  };
}

// Kontext pro globální přístup ke zvukům
import { createContext, useContext, ReactNode } from 'react';

interface SoundContextType {
  playSound: (name: SoundName) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const sound = useSound();
  
  return (
    <SoundContext.Provider value={sound}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider');
  }
  return context;
}
