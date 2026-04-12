import { useState } from 'react';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Services } from './components/Services';
import { Terminal } from './components/Terminal';
import { Chat } from './components/Chat';
import { useAudioDrone } from './hooks/useAudioDrone';
import { BlackHoleBackground } from './components/ParticleBackground';
import { Dock } from './components/Dock';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  useAudioDrone();

  return (
    <div className="min-h-screen bg-abyssal text-silver font-mono selection:bg-silver/30 selection:text-sterile relative">
      <BlackHoleBackground isDescending={isDescending} />
      <Hero 
        onStartSequence={() => setIsChatOpen(true)} 
        isDescending={isDescending} 
        onDescend={() => setIsDescending(true)} 
      />
      <Manifesto />
      <Services />
      <Terminal />
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Dock />
    </div>
  );
}
