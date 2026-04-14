import { motion } from 'motion/react';
import { TextDecode } from './TextDecode';

export function Hero({ onStartSequence, isDescending, onDescend }: { onStartSequence: () => void, isDescending?: boolean, onDescend?: () => void }) {
  return (
    <section className="relative min-h-[150vh] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        
        {/* SVG Logo */}
        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isDescending ? 0 : 1, 
            rotateX: isDescending ? -15 : 0, 
            y: isDescending ? -100 : 0, 
            filter: isDescending ? 'blur(20px)' : 'blur(0px)' 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000, maxWidth: '120px', margin: '0 auto 20px auto', display: 'block' }}
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
            <defs>
              <filter id="zarfido-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <style>
              {`
              .aurnem-path {
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                animation: draw-in 3.5s cubic-bezier(0.25, 0.1, 0.21, 1) forwards;
              }
              .hex-outer {
                stroke: #B0B5B9;
                stroke-width: 1.5;
                stroke-dasharray: 480;
                stroke-dashoffset: 480;
              }
              .hex-inner {
                stroke: #B0B5B9;
                stroke-width: 0.5;
                stroke-dasharray: 400;
                stroke-dashoffset: 400;
                animation-delay: 0.8s;
                opacity: 0.6;
              }
              .core-orbit-1 { stroke: #B0B5B9; stroke-width: 1; stroke-dasharray: 300; stroke-dashoffset: 300; animation-delay: 1.2s; }
              .core-orbit-2 { stroke: #2b0f1a; stroke-width: 1.5; stroke-dasharray: 320; stroke-dashoffset: 320; animation-delay: 1.6s; filter: url(#zarfido-glow); }
              .core-orbit-3 { stroke: #B0B5B9; stroke-width: 1; stroke-dasharray: 280; stroke-dashoffset: 280; animation-delay: 2.0s; }
              .core-orbit-4 { stroke: #2b0f1a; stroke-width: 1.5; stroke-dasharray: 330; stroke-dashoffset: 330; animation-delay: 2.4s; filter: url(#zarfido-glow); }
              .core-anomaly { stroke: #B0B5B9; stroke-width: 1; stroke-dasharray: 30; stroke-dashoffset: 30; animation-delay: 3s; }
              @keyframes draw-in { to { stroke-dashoffset: 0; } }
              #aurnem-core { transform-origin: 100px 100px; animation: cosmic-pulse 30s ease-in-out infinite; }
              @keyframes cosmic-pulse {
                0% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(90deg) scale(1.02); }
                50% { transform: rotate(180deg) scale(0.98); }
                75% { transform: rotate(270deg) scale(1.04); }
                100% { transform: rotate(360deg) scale(1); }
              }
              `}
            </style>

            <g id="aurnem-structure">
              <polygon className="aurnem-path hex-outer" points="100,20 169.28,60 169.28,140 100,180 30.72,140 30.72,60" />
              <polygon className="aurnem-path hex-inner" points="100,20 169.28,140 30.72,140" />
              <polygon className="aurnem-path hex-inner" points="100,180 169.28,60 30.72,60" />
              <line className="aurnem-path hex-inner" x1="100" y1="20" x2="100" y2="180" />
            </g>

            <g id="aurnem-core">
              <ellipse className="aurnem-path core-orbit-1" cx="100" cy="100" rx="24" ry="68" transform="rotate(15 100 100)" />
              <ellipse className="aurnem-path core-orbit-2" cx="100" cy="100" rx="18" ry="76" transform="rotate(72 100 100)" />
              <ellipse className="aurnem-path core-orbit-3" cx="100" cy="100" rx="28" ry="60" transform="rotate(128 100 100)" />
              <ellipse className="aurnem-path core-orbit-4" cx="100" cy="100" rx="14" ry="80" transform="rotate(-33 100 100)" />
              <circle className="aurnem-path core-anomaly" cx="100" cy="100" r="4" />
              <circle className="aurnem-path core-anomaly" cx="100" cy="100" r="1.5" style={{ stroke: '#2b0f1a', animationDelay: '3.2s' }} />
            </g>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isDescending ? 0 : 1, 
            rotateX: isDescending ? -15 : 0, 
            y: isDescending ? -100 : 0, 
            filter: isDescending ? 'blur(20px)' : 'blur(0px)' 
          }}
          transition={{ duration: 1.5, delay: isDescending ? 0 : 0.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 uppercase text-sterile">
            <TextDecode text="AURNEM DYNAMICS." delay={500} duration={1500} />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isDescending ? 0 : 1, 
            rotateX: isDescending ? -15 : 0, 
            y: isDescending ? -100 : 0, 
            filter: isDescending ? 'blur(20px)' : 'blur(0px)' 
          }}
          transition={{ duration: 1.5, delay: isDescending ? 0 : 1, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
          className="text-silver/80 font-mono text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Arquitectura de lo Imposible. Sistemas que no responden a forma ni a intención. Diseñamos, automatizamos y escalamos ecosistemas de inteligencia artificial que devoran el mercado.
        </motion.p>

        <motion.button
          onClick={() => {
            if (onDescend) onDescend();
            setTimeout(onStartSequence, 1500); // Wait for descend animation before opening chat
          }}
          className="inline-block mt-12 px-10 py-4 border border-silver/30 rounded-full text-sterile font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden glass-panel hover:border-silver hover:shadow-[0_0_20px_rgba(176,181,185,0.4)] cursor-pointer"
          initial={{ opacity: 0, rotateX: 15, y: 100, scale: 0.98, filter: 'blur(15px)' }}
          animate={{ 
            opacity: isDescending ? 0 : 1, 
            rotateX: isDescending ? -15 : 0, 
            y: isDescending ? -100 : 0, 
            scale: isDescending ? 0.9 : 1,
            filter: isDescending ? 'blur(20px)' : 'blur(0px)' 
          }}
          transition={{ duration: 1.5, delay: isDescending ? 0 : 1.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
        >
          [ INICIAR SECUENCIA ]
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        animate={{ 
          y: isDescending ? 100 : [0, 10, 0],
          opacity: isDescending ? 0 : 0.5
        }}
        transition={{ 
          y: isDescending ? { duration: 1 } : { repeat: Infinity, duration: 2, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
      >
        <span className="text-xs uppercase tracking-widest">Descender</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-silver to-transparent" />
      </motion.div>
    </section>
  );
}
