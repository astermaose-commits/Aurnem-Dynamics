import { motion } from 'motion/react';
import { MessageCircle, Mail, Instagram, Calendar } from 'lucide-react';

export function Dock() {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 1, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-2xl border border-magic-blue/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)'
      }}
    >
      <a href="#" className="p-3 rounded-xl text-silver hover:text-magic-blue hover:bg-magic-blue/10 transition-all duration-300 group">
        <MessageCircle className="w-5 h-5 group-hover:scale-110 group-hover:animate-pulse transition-transform" />
      </a>
      <a href="#" className="p-3 rounded-xl text-silver hover:text-magic-blue hover:bg-magic-blue/10 transition-all duration-300 group">
        <Mail className="w-5 h-5 group-hover:scale-110 group-hover:animate-pulse transition-transform" />
      </a>
      <a href="#" className="p-3 rounded-xl text-silver hover:text-magic-blue hover:bg-magic-blue/10 transition-all duration-300 group">
        <Instagram className="w-5 h-5 group-hover:scale-110 group-hover:animate-pulse transition-transform" />
      </a>
      
      <div className="w-[1px] h-8 bg-silver/20 mx-2" />
      
      <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-magic-blue/10 text-magic-blue border border-magic-blue/30 hover:bg-magic-blue hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 font-sans font-semibold tracking-wide text-sm">
        <Calendar className="w-4 h-4" />
        RESERVAR AGENDA
      </a>
    </motion.div>
  );
}
