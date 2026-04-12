import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
// Esto permite que el mesero entienda los mensajes en formato JSON
app.use(express.json()); 

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Falta la API Key en el archivo .env");
}

const genAI = new GoogleGenerativeAI({ apiKey: apiKey });

// Esta es la "ventanilla" donde el Chat va a hacer sus pedidos
app.post('/api/asistente', async (req, res) => {
  try {
    const preguntaDelUsuario = req.body.pregunta;

    const modelo = genAI.getGenerativeModel({ 
      model: "gemini-3.1-pro",
      systemInstruction: `Eres el agente de soporte técnico de este ecosistema. 
      Tu objetivo es guiar a los usuarios. Sé directo, elegante y profesional. 
      Resuelve sus dudas basándote solo en los servicios de la página.`, 
    });

    const respuesta = await modelo.generateContent(preguntaDelUsuario);
    
    // Devolvemos solo la respuesta al frontend, la llave jamás sale de aquí
    res.json({ respuesta: respuesta.text }); 

  } catch (error) {
    console.error("Error en la cocina:", error);
    res.status(500).json({ respuesta: "Error al procesar la solicitud." });
  }
});

// Encendemos el servidor en el puerto 3001
const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Cocina (Backend) operando de forma segura en el puerto ${PUERTO}`);
});