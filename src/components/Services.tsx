import { motion } from 'motion/react';
import { TextDecode } from './TextDecode';

const services = [
  {
    title: "AUTÓMATAS DE INTERACCIÓN",
    subtitle: "Desarrollo IA",
    description: "Creación de software a medida y agentes conversacionales. IAs que asumen roles operativos completos: responden llamadas, gestionan mensajería y cierran ventas 24/7.",
    icon: "01"
  },
  {
    title: "INGENIERÍA DE PERSUASIÓN",
    subtitle: "Marketing & Ads",
    description: "Copywriting quirúrgico que arranca el corazón de todo verbo. Estructuras narrativas galardonadas para manipular la psicología del consumidor y maximizar el ROAS.",
    icon: "02"
  },
  {
    title: "ECOSISTEMAS SENSORIALES",
    subtitle: "Media & Branding",
    description: "Diseño sonoro, instrumentales propios y audio branding, asegurando que cada marca no solo se vea, sino que se sienta como una fuerza inevitable.",
    icon: "03"
  }
];

export function Services() {
  return (
    <section className="relative min-h-[150vh] py-32 px-6 border-t border-silver/10 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
          className="mb-24 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-sterile">
            <TextDecode text="CATÁLOGO DE SOLUCIONES." />
          </h2>
          <p className="text-silver/60 font-mono text-lg max-w-2xl mx-auto">
            Sistemas diseñados para dominar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
              style={{ transformPerspective: 1000 }}
              className="group relative glass-panel hover:border-silver/30 transition-colors duration-500"
            >
              <div className="absolute top-0 right-0 p-4 text-4xl font-black text-elements group-hover:text-silver/20 transition-colors duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-sterile mb-2 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="text-silver/50 font-mono text-sm mb-6 uppercase tracking-widest">
                [ {service.subtitle} ]
              </p>
              <p className="text-silver/80 font-mono text-sm leading-relaxed">
                {service.description}
              </p>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-silver/50 group-hover:w-full transition-all duration-500 ease-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
