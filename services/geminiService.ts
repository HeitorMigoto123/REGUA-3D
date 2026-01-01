
import { GoogleGenAI, Type } from "@google/genai";
import { Dimensions, MeasurementMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDimensions(base64Image: string, mode: MeasurementMode): Promise<Dimensions> {
  // Use gemini-3-pro-preview for advanced spatial reasoning and accurate measurements.
  const model = 'gemini-3-pro-preview';
  
  const systemPrompt = mode === 'person' 
    ? `Aja como um especialista em biometria e visão computacional.
Analise a imagem e estime a ALTURA (estatura) da pessoa visível em CENTÍMETROS.
O usuário foi instruído a alinhar os PÉS da pessoa com uma guia horizontal na base da moldura da câmera. Use essa informação de alinhamento e o plano do chão para calibrar sua estimativa.
Identifique o topo da cabeça e utilize referências de escala no ambiente (portas, interruptores, móveis padrão) para determinar a altura exata.
Forneça os resultados em formato JSON. Mesmo que seja uma pessoa, preencha largura e profundidade aproximadas (ombros/perfil).`
    : `Aja como um especialista em medição espacial.
Analise a imagem e estime as dimensões físicas (largura, altura e profundidade) do objeto principal em CENTÍMETROS.
Procure por pistas de contexto (azulejos, moedas, móveis) para determinar a escala.
Forneça os resultados em formato JSON.`;

  // Fix: Follow @google/genai guidelines by passing a single Content object instead of an array when possible, and include thinkingBudget.
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: systemPrompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ]
    },
    config: {
      // Thinking budget helps the model perform complex multi-step reasoning for scale estimation.
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          width_cm: { type: Type.NUMBER, description: "Largura ou envergadura em cm" },
          height_cm: { type: Type.NUMBER, description: "Altura ou estatura em cm" },
          depth_cm: { type: Type.NUMBER, description: "Profundidade ou espessura em cm" },
          object_name: { type: Type.STRING, description: "Nome/Identificação da pessoa ou objeto" },
          explanation: { type: Type.STRING, description: "Lógica de estimativa usada" }
        },
        required: ["width_cm", "height_cm", "depth_cm", "object_name", "explanation"]
      }
    }
  });

  // Extract text directly from the response object property.
  const text = response.text;
  if (!text) throw new Error("A IA não retornou dados válidos.");

  const parsed = JSON.parse(text);
  return { ...parsed, mode } as Dimensions;
}
