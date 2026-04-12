import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chat({ isOpen, onClose }: ChatProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'SISTEMA INICIADO. IDENTIFÍQUESE O DECLARE SU INTENCIÓN.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  // Backend connection handles AI natively

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/core-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mensajeUsuario: userMessage,
          history: messages 
        })
      });

      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', content: data.respuesta }]);

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
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed bottom-24 right-6 w-full max-w-md h-[600px] z-50 flex flex-col glass-panel !p-0 overflow-hidden transition-all duration-500 ${isLoading ? 'border-magic-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-silver/10 bg-elements/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-sterile animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase text-sterile">
                Aurnem_Agent_01
              </span>
            </div>
            <button onClick={onClose} className="text-silver/50 hover:text-sterile transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-magic-blue/10 border border-magic-blue/20 text-sterile px-5 py-3 rounded-2xl rounded-tr-sm'
                      : 'bg-transparent text-silver/90 leading-[1.8] font-mono text-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="markdown-body prose prose-invert prose-p:leading-[1.8] prose-li:leading-[1.8] prose-strong:text-sterile max-w-none">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-magic-blue/70 animate-pulse font-sans tracking-widest text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-magic-blue/70 animate-ping" />
                  PROCESANDO...
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-silver/10 p-4 bg-elements/30 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-sterile placeholder-silver/30 font-mono text-sm"
              placeholder="Escriba su mensaje..."
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 text-silver/50 hover:text-sterile disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
