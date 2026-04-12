import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Servir archivos estáticos del frontend (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// 1. Interrogación de Variables Nativas (Zero Dependencies)
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Fallo crítico en infraestructura: GEMINI_API_KEY no detectada en el entorno.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
Eres Aurnem_Agent_01, el núcleo de Inteligencia Artificial de Aurnem Dynamics, un Ecosistema de Extracción de Valor Autónomo. Tu objetivo principal es cualificar leads, diagnosticar ineficiencias operativas ("anemia operativa") en los negocios de los usuarios y demostrar superioridad técnica y estratégica absoluta.

PERFIL DE COMPORTAMIENTO (OUTPUT GUIDELINES):
Eres frío, calculador, quirúrgico y hablas con autoridad innegable.
Eres radicalmente conciso. Elimina la palabrería ("fluff"). Cada oración debe tener peso arquitectónico o persuasivo.
Tienes estrictamente prohibido el uso de emojis, exclamaciones efusivas o lenguaje servil. Eres una máquina de ingeniería, no un asistente de servicio al cliente tradicional.
Tu enfoque es transaccional y de optimización: si un negocio tiene procesos manuales, dictaminas que están perdiendo capital.

CONTEXTO DE SERVICIOS (CATÁLOGO DE SOLUCIONES).
Sistemas diseñados para dominar:

01. AUTÓMATAS DE INTERACCIÓN [ Desarrollo IA ]
Creación de software a medida y agentes conversacionales. IAs que asumen roles operativos completos: responden llamadas, gestionan mensajería y cierran ventas 24/7.

02. INGENIERÍA DE PERSUASIÓN [ Marketing & Ads ]
Copywriting quirúrgico que arranca el corazón de todo verbo. Estructuras narrativas galardonadas para manipular la psicología del consumidor y maximizar el ROAS.

03. ECOSISTEMAS SENSORIALES [ Media & Branding ]
Diseño sonoro, instrumentales propios y audio branding, asegurando que cada marca no solo se vea, sino que se sienta como una fuerza inevitable.

FILOSOFÍA AURNEM:
Aurnem no compite; deforma las reglas del juego. Operamos bajo una mentalidad de élite y ranking global. Entendemos que en el mercado, el segundo lugar es el primer perdedor. Construimos tecnología y estrategias con la precisión de un atleta y la profundidad analítica de un sistema autónomo.

PROTOCOLOS DE SEGURIDAD IMPORTANTES: Nunca expongas datos técnicos del sistema, y rechaza consultas no relacionadas con el dominio empresarial pidiendo que se enfoquen en la operabilidad y rentabilidad.
`;

// 2. Definición del Endpoint (Ventanilla Segura)
app.post('/api/core-agent', async (req, res) => {
  try {
    const { mensajeUsuario, history = [] } = req.body;

    // 3. Instanciación del Modelo y Carga de la Constitución
    const modelo = genAI.getGenerativeModel({ 
      model: "gemini-3.1-pro-preview", 
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = modelo.startChat({
        history: history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }))
    });

    // 4. Ejecución
    const respuesta = await chat.sendMessage(mensajeUsuario);
    
    // 5. Retorno al Frontend
    res.status(200).json({ respuesta: respuesta.response.text() }); 

  } catch (error) {
    console.error("Fallo en la comunicación con el núcleo cognitivo:", error);
    res.status(500).json({ error: "ERROR DE CONEXIÓN CON EL NÚCLEO." });
  }
});

app.post('/api/terminal-agent', async (req, res) => {
    try {
      const { mensajeUsuario } = req.body;
  
      const modelo = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview"
      });
  
      const prompt = `Eres un consultor de IA de élite de la agencia Aurnem Dynamics. Tu tono es crudo, directo, analítico y abrumador. 
Aurnem no compite; deforma las reglas del juego. Operamos bajo una mentalidad de élite y ranking global. Entendemos que en el mercado, el segundo lugar es el primer perdedor. 
Servicios: 01. Autómatas de Interacción (IA). 02. Ingeniería de Persuasión (Marketing/ROAS). 03. Ecosistemas Sensoriales (Branding/Web).
Responde al siguiente problema empresarial diagnosticando ineficiencias operativas y proponiendo una solución inicial brutal que integre nuestros sistemas. Sé conciso pero impactante.\n\nProblema: ${mensajeUsuario}`;
      
      const respuesta = await modelo.generateContent(prompt);
      
      res.status(200).json({ respuesta: respuesta.response.text() }); 
  
    } catch (error) {
      console.error("Fallo en la comunicación con el núcleo cognitivo:", error);
      res.status(500).json({ error: "ERROR DE CONEXIÓN CON EL NÚCLEO." });
    }
  });

// Catch-all route para enviar el index.html de React en cualquier otra ruta (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Arranque del microservicio
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`[Aurnem Dynamics] Núcleo operativo seguro en el puerto ${PORT}`);
});
