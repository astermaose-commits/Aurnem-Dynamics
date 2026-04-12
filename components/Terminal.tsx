import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

export function Terminal() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system', content: string }[]>([
    { role: 'system', content: 'AURNEM DYNAMICS TERMINAL INICIADA.\n> INGRESE EL PROBLEMA DE SU EMPRESA PARA ANÁLISIS.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFocus = () => {
    window.dispatchEvent(new Event('terminal-focus'));
  };

  const handleBlur = () => {
    window.dispatchEvent(new Event('terminal-blur'));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: `> ${userMessage}` }]);
    setIsLoading(true);

    // Initial empty system message to append to
    setMessages(prev => [...prev, { role: 'system', content: '' }]);

    try {
      const response = await fetch('/api/terminal-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mensajeUsuario: userMessage 
        })
      });

      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();

      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { ...newMessages[lastIndex], content: newMessages[lastIndex].content + data.respuesta };
        return newMessages;
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { ...newMessages[lastIndex], content: 'ERROR DE CONEXIÓN CON EL NÚCLEO.' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        window.dispatchEvent(new Event('terminal-blur'));
      }, 1000);
    }
  };

  return (
    <section className="relative min-h-[150vh] py-32 px-6 border-t border-silver/10 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-sterile">
            TERMINAL DE PRUEBA.
          </h2>
          <p className="text-silver/60 font-mono text-lg max-w-2xl mx-auto uppercase tracking-widest">
            [ Demostración en Vivo ]
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotateX: 15, y: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ transformPerspective: 1000 }}
          className={`w-full h-[500px] glass-panel flex flex-col font-mono text-sm relative !p-0 overflow-hidden transition-all duration-500 ${isLoading ? 'border-magic-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}
        >
          {/* Terminal Header */}
          <div className="flex items-center px-4 py-2 border-b border-silver/10 bg-elements/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-silver/20" />
              <div className="w-3 h-3 rounded-full bg-silver/20" />
              <div className="w-3 h-3 rounded-full bg-silver/20" />
            </div>
            <div className="mx-auto text-silver/50 tracking-widest text-xs uppercase">
              Aurnem_Core_v2.0.sh
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-silver">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-magic-blue/10 border border-magic-blue/20 text-sterile px-5 py-3 rounded-2xl rounded-tr-sm' : 'text-silver/90 leading-[1.8] font-mono text-sm'}`}>
                  {msg.role === 'user' ? (
                    msg.content.replace('> ', '')
                  ) : (
                    <div className="markdown-body prose prose-invert prose-p:leading-[1.8] prose-li:leading-[1.8] prose-strong:text-sterile max-w-none">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="text-magic-blue/70 animate-pulse font-sans tracking-widest text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-magic-blue/70 animate-ping" />
                PROCESANDO DATOS...
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleSubmit} className="border-t border-silver/10 p-4 bg-elements/30 flex items-center">
            <span className="text-sterile mr-2">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-sterile placeholder-silver/30 font-mono"
              placeholder="Describa su problema operativo o de mercado..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </motion.div>
      </div>
    </section>
  );
}
