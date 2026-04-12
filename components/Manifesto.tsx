import { motion } from 'motion/react';
import { TextDecode } from './TextDecode';

export function Manifesto() {
  return (
    <section className="relative min-h-[150vh] flex items-center justify-center py-32 px-6 border-t border-silver/10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8 text-sterile">
            <TextDecode text="EL ADN DE LA AGENCIA." />
          </h2>
          <div className="w-12 h-1 bg-silver/50 mb-8" />
        </motion.div>

        <motion.div
          className="space-y-8 text-base md:text-lg text-silver/80 font-mono leading-relaxed glass-panel"
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
        >
          <p>
            Aurnem no compite; deforma las reglas del juego. Operamos bajo una mentalidad de élite y ranking global. Entendemos que en el mercado, el segundo lugar es el primer perdedor. Construimos tecnología y estrategias con la precisión de un atleta y la profundidad analítica de un sistema autónomo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
