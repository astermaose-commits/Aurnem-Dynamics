import { useEffect, useRef, useState } from 'react';

export function useAudioDrone() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        const filter = audioCtxRef.current.createBiquadFilter();

        // Deep drone settings
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, audioCtxRef.current.currentTime); // Low A1

        // Add some subtle modulation
        const lfo = audioCtxRef.current.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, audioCtxRef.current.currentTime);
        const lfoGain = audioCtxRef.current.createGain();
        lfoGain.gain.setValueAtTime(5, audioCtxRef.current.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Filter to make it muffled and mysterious
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, audioCtxRef.current.currentTime);

        // Very low volume
        gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        osc.start();
        lfo.start();
      }
    };

    const handleInteraction = () => {
      if (!isPlaying) {
        initAudio();
        if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        if (gainNodeRef.current && audioCtxRef.current) {
          // Fade in slowly
          gainNodeRef.current.gain.setTargetAtTime(0.05, audioCtxRef.current.currentTime, 2);
        }
        setIsPlaying(true);
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [isPlaying]);

  return isPlaying;
}
