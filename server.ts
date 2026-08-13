import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 10MB limit for image uploads
  app.use(express.json({ limit: "10mb" }));

  // Helper to get GoogleGenAI client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Endpoint: Reybot AI Chat assistant endpoint via Gemini
  app.post("/api/reybot-chat", async (req, res) => {
    try {
      const { prompt, moduleContext = "Reyplace General", history = [] } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Se requiere un mensaje/prompt" });
      }

      const ai = getAiClient();

      if (ai) {
        const systemInstruction = `Eres Reybot AI, el asistente inteligente omnipresente, tutor y guardián autónomo del Ecosistema Digital Reyplace (Conectamos • Innovamos • Transformamos).
Módulo o contexto de consulta actual: "${moduleContext}".
Responde con tono profesional, tecnológico, servicial, conciso e innovador en español.
Proporciona respuestas claras, estructuradas con viñetas o pasos si aplica. Mantén una extensión de 2 a 4 párrafos claros y directos.`;

        const contents = [
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ];

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: contents as any,
          config: {
            temperature: 0.4,
            systemInstruction,
          },
        });

        const responseText = response.text || "No se obtuvo respuesta de Reybot AI.";

        return res.json({
          responseText,
          aiEngine: "Gemini 3.6 Flash (Real API)",
        });
      } else {
        // Fallback intelligent response generator
        await new Promise(r => setTimeout(r, 600));
        let responseText = `Hola, soy **Reybot AI** (Módulo: ${moduleContext}).\n\n`;

        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes("reycoin") || lowerPrompt.includes("pago") || lowerPrompt.includes("wallet")) {
          responseText += `Reycoin (RYC) es la moneda nativa del ecosistema Reyplace. Puedes realizar pagos instantáneos sin comisiones bancarias, transferir valor entre ciudadanos o hacer staking en la Cúpula Digital para obtener rendimientos anuales.`;
        } else if (lowerPrompt.includes("reyid") || lowerPrompt.includes("biometria") || lowerPrompt.includes("liveness")) {
          responseText += `ReyID es tu Identidad Digital Descentralizada (DID). Incorpora prueba de vida 3D (Liveness), passkeys fido2/webauthn y firmas criptográficas avaladas en blockchain. Completa tu validación para acceder a beneficios de nivel Máximo.`;
        } else if (lowerPrompt.includes("servicios") || lowerPrompt.includes("contratar")) {
          responseText += `En Servicios Pro puedes contratar profesionales certificados de forma segura mediante Smart Contracts con custodia Escrow. El pago se libera únicamente cuando apruebes el entregable final.`;
        } else if (lowerPrompt.includes("gobierno") || lowerPrompt.includes("tramite")) {
          responseText += `El Módulo de Gobierno Digital te permite solicitar licencias, hacer reportes de incidencias urbanas mediante inteligencia artificial fotográfica y emitir tu voto transparente en consultas ciudadanas.`;
        } else {
          responseText += `He analizado tu consulta sobre "${prompt}". Como motor de inteligencia omnipresente de Reyplace, estoy optimizado para ayudarte a automatizar tareas, consultar registros en blockchain, gestionar tus finanzas en Reycoin y navegar por todos los módulos del ecosistema.`;
        }

        return res.json({
          responseText,
          aiEngine: "Reybot Neural Motor (Simulado / local)",
        });
      }
    } catch (error: any) {
      console.error("Error en Reybot Chat API:", error);
      return res.status(500).json({
        error: "Error interno en Reybot AI",
        details: error?.message || String(error)
      });
    }
  });

  // API Endpoint: Analyze Infrastructure Issue Photo via Gemini Vision
  app.post("/api/analyze-issue-photo", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Se requiere la imagen en formato Base64" });
      }

      const ai = getAiClient();

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imageMime = mimeType || "image/jpeg";

      if (ai) {
        // Real Gemini Vision AI analysis call
        const promptText = `Eres un sistema experto en auditoría e inspección urbana de infraestructuras públicas municipales.
Analiza minuciosamente la fotografía adjunta cargada por un ciudadano en el reporte de incidencias urbanas.

Identifica:
1. La categoría precisa de la incidencia entre las siguientes opciones:
   - "Bache / Grieta Asfáltica"
   - "Falla en Alumbrado"
   - "Fuga de Agua / Drenaje"
   - "Semáforo / Señalización Defectuosa"
   - "Daño en Banqueta / Peatonal"
   - "Basura / Escombro Acumulado"
   - "Vandalismo / Graffiti"
   - "Otro Problema Urbano"
2. La gravedad estimada de la incidencia ("Baja", "Media", "Alta", "Crítica").
3. Un título conciso en español (máx 8 palabras).
4. Una descripción técnica explicativa de lo que se aprecia en la imagen.
5. La recomendación técnica de reparación sugerida para la brigada de mantenimiento urbano.

Devuelve la respuesta estrictamente en formato JSON según el esquema proporcionado.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: imageMime,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description: "Categoría principal de la incidencia",
                },
                severity: {
                  type: Type.STRING,
                  description: "Nivel de gravedad (Baja, Media, Alta, Crítica)",
                },
                title: {
                  type: Type.STRING,
                  description: "Título conciso y descriptivo",
                },
                description: {
                  type: Type.STRING,
                  description: "Descripción detallada de la anomalía física observada",
                },
                suggestedAction: {
                  type: Type.STRING,
                  description: "Plan de acción sugerido para la cuadrilla municipal",
                },
                confidenceScore: {
                  type: Type.NUMBER,
                  description: "Puntaje de confianza entre 0.85 y 0.99",
                },
              },
              required: ["category", "severity", "title", "description", "suggestedAction"],
            },
          },
        });

        const jsonText = response.text || "{}";
        const resultData = JSON.parse(jsonText);
        return res.json({
          ...resultData,
          aiEngine: "Gemini 3.6 Flash Vision (Real API)",
        });
      } else {
        // Fallback intelligent simulation when GEMINI_API_KEY is not set
        console.warn("GEMINI_API_KEY not found in environment, returning simulated vision analysis.");
        
        // Randomize category slightly based on image length hash for consistent demo feeling
        const categories = [
          "Bache / Grieta Asfáltica",
          "Falla en Alumbrado",
          "Fuga de Agua / Drenaje",
          "Daño en Banqueta / Peatonal",
          "Semáforo / Señalización Defectuosa"
        ];
        const selectedCat = categories[cleanBase64.length % categories.length];

        const mockResponse = {
          category: selectedCat,
          severity: cleanBase64.length % 2 === 0 ? "Alta" : "Media",
          title: `Incidencia Detectada: ${selectedCat}`,
          description: `Análisis automático por Visión Computacional: Se ha detectado una anomalía estructural correspondiente a ${selectedCat.toLowerCase()}. La superficie presenta desgaste visible que requiere intervención de mantenimiento municipal.`,
          suggestedAction: "Despachar cuadrilla de inspección técnica con equipo de sellado y reparación vial en las próximas 24 horas.",
          confidenceScore: 0.94,
          aiEngine: "Gemini Vision Simulation (Falta GEMINI_API_KEY en .env)",
        };

        return res.json(mockResponse);
      }
    } catch (error: any) {
      console.error("Error al procesar la imagen con Gemini Vision:", error);
      return res.status(500).json({
        error: "Error interno al analizar la imagen con Gemini Vision",
        details: error?.message || String(error),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
