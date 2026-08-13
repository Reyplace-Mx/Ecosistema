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
