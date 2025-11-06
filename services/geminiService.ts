import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiAdResponse, ProductAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ImageInput {
    data: string;
    mimeType: string;
}

export async function analyzeProduct(
    image?: ImageInput,
    productUrl?: string
): Promise<ProductAnalysis> {
    if (!image && !productUrl) {
        throw new Error("Either an image or a product URL must be provided for analysis.");
    }

    const promptIntro = "Você é um especialista em catalogação de produtos para e-commerce. Sua tarefa é extrair informações de um produto a partir do que for fornecido.";
    let promptInstruction = "";
    let parts: any[];

    const textPart = { text: "" };

    if (image) {
        promptInstruction = "Analise a imagem fornecida e extraia as seguintes informações sobre o produto:";
        textPart.text = `
            ${promptIntro}
            ${promptInstruction}

            1.  **Nome do Produto:** Crie um nome de produto claro e conciso.
            2.  **Detalhes do Produto:** Descreva as características principais, como material, cor, estilo, e funcionalidades visíveis ou implícitas.
            3.  **Público-alvo:** Sugira o público-alvo mais provável para este produto.

            Retorne o resultado estritamente no formato JSON especificado.
        `;
        parts = [textPart, { inlineData: { data: image.data, mimeType: image.mimeType } }];
    } else { // productUrl
        promptInstruction = `A partir da URL de produto fornecida (${productUrl}), e com base no seu conhecimento sobre produtos deste tipo de marketplace, extraia as seguintes informações (Não acesse a URL, use seu conhecimento sobre os produtos do domínio):`;
        textPart.text = `
            ${promptIntro}
            ${promptInstruction}

            1.  **Nome do Produto:** Crie um nome de produto claro e conciso.
            2.  **Detalhes do Produto:** Descreva as características principais, como material, cor, estilo, e funcionalidades.
            3.  **Público-alvo:** Sugira o público-alvo mais provável para este produto.

            Retorne o resultado estritamente no formato JSON especificado.
        `;
        parts = [textPart];
    }
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    productName: { type: Type.STRING, description: "O nome do produto extraído." },
                    productDetails: { type: Type.STRING, description: "Os detalhes e características do produto." },
                    targetAudience: { type: Type.STRING, description: "O público-alvo sugerido." },
                },
                required: ["productName", "productDetails", "targetAudience"]
            },
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as ProductAnalysis;
    } catch (e) {
        console.error("Failed to parse Gemini analysis response:", jsonText);
        throw new Error("A resposta da API de análise não estava no formato JSON esperado.");
    }
}


export async function generateAdContent(
    productName: string, 
    productDetails: string, 
    targetAudience: string,
    image?: ImageInput
): Promise<GeminiAdResponse> {
    
    const prompt = `
        Você é um especialista em e-commerce e Google Shopping Ads.
        Com base nas informações do produto abaixo (e na imagem, se fornecida), gere o conteúdo para um anúncio.

        **Nome do Produto:** ${productName}
        **Detalhes do Produto:** ${productDetails}
        **Público-alvo:** ${targetAudience || 'Geral'}

        **Sua tarefa é:**
        1.  **Criar um Título:** Gere um título de produto conciso e otimizado para SEO, com no máximo 150 caracteres. Se uma imagem for fornecida, use-a para refinar o título (ex: mencionando a cor ou estilo principal).
        2.  **Escrever uma Descrição:** Crie uma descrição de produto atraente com no máximo 5000 caracteres, destacando os principais recursos e benefícios. Se uma imagem for fornecida, incorpore detalhes visuais da imagem na descrição (ex: cor, estilo, material aparente, detalhes de design).
        3.  **Sugerir Categoria:** Sugira o caminho da Categoria de Produto do Google mais apropriado (ex: Casa e jardim > Decoração > Tapetes). A imagem pode ajudar a determinar a categoria correta com mais precisão.
        4.  **Validar Conformidade:** Analise as informações do produto, a imagem e o conteúdo gerado em relação às políticas comuns de anúncios do Google Shopping. Identifique possíveis violações relacionadas a conteúdo proibido, produtos restritos e padrões editoriais. Forneça um status ('approved' ou 'review_needed') e um feedback explicando quaisquer problemas encontrados ou confirmando a conformidade.

        Retorne o resultado estritamente no formato JSON especificado.
    `;

    const textPart = { text: prompt };
    const parts = image
        ? [textPart, { inlineData: { data: image.data, mimeType: image.mimeType } }]
        : [textPart];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "O título otimizado do produto." },
                    description: { type: Type.STRING, description: "A descrição otimizada do produto." },
                    category: { type: Type.STRING, description: "A categoria de produto sugerida pelo Google." },
                    compliance: {
                        type: Type.OBJECT,
                        properties: {
                            status: { type: Type.STRING, description: "Status de conformidade: 'approved' ou 'review_needed'." },
                            feedback: { type: Type.STRING, description: "Explicação detalhada da análise de conformidade." }
                        },
                        required: ["status", "feedback"]
                    }
                },
                required: ["title", "description", "category", "compliance"]
            },
        },
    });

    const jsonText = response.text.trim();
    
    try {
        return JSON.parse(jsonText) as GeminiAdResponse;
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonText);
        throw new Error("A resposta da API não estava no formato JSON esperado.");
    }
}