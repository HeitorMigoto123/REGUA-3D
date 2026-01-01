
import { GoogleGenAI, Type } from "@google/genai";
import { Dimensions, MeasurementMode } from "../types.ts";

export async function analyzeDimensions(base64Image: string, mode: MeasurementMode): Promise<Dimensions> {
  // Inicializa o cliente apenas no momento da chamada para garantir que a chave esteja disponível
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Modelo avançado para raciocínio espacial
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = mode === 'person' 
    ? `Você é um sistema de visão computacional especializado em biometria.
Analise a imagem e determine a altura exata da pessoa em centímetros.
A pessoa está alinhada com a base da imagem. Use objetos ao redor (portas, tomadas, móveis) para calibrar a escala.
Seja preciso e retorne apenas o JSON.`
    : `Você é um especialista em medição técnica.
Estime largura, altura e profundidade do objeto principal em centímetros.
Use referências de escala no ambiente.
Retorne os dados exclusivamente em formato JSON.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: systemInstruction },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            width_cm: { type: Type.NUMBER },
            height_cm: { type: Type.NUMBER },
            depth_cm: { type: Type.NUMBER },
            object_name: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["width_cm", "height_cm", "depth_cm", "object_name", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou uma resposta textual.");

    const parsed = JSON.parse(text);
    return { ...parsed, mode } as Dimensions;
  } catch (error) {
    console.error("Erro no Gemini Service:", error);
    throw error;
  }
}
