import { motion } from 'motion/react';

interface TextDecodeProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  targetLetterSpacing?: string;
}

export function TextDecode({ text, className = '', delay = 0, duration = 1200, targetLetterSpacing = "0em" }: TextDecodeProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ 
        opacity: 0, 
        filter: 'blur(12px)', 
        letterSpacing: '0.5em'
      }}
      whileInView={{ 
        opacity: 1, 
        filter: 'blur(0px)', 
        letterSpacing: targetLetterSpacing
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: duration / 1000, 
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {text}
    </motion.span>
  );
}
