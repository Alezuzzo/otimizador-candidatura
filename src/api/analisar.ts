// Importa os tipos da Vercel e a biblioteca do Google AI
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Função principal que será executada quando a nossa API for chamada
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // A validação da chave de API e a inicialização do cliente estão agora DENTRO da função.
  const apiKey = process.env.GOOGLE_API_KEY;

  // Validação inicial para garantir que a chave de API foi configurada
  if (!apiKey) {
    console.error("A variável de ambiente GOOGLE_API_KEY não está definida.");
    return response.status(500).json({ error: "Erro de configuração do servidor." });
  }

  // Inicializa o cliente do Google AI com a nossa chave
  const genAI = new GoogleGenerativeAI(apiKey);

  // Medida de segurança: Apenas aceita requisições do tipo POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Pega a descrição da vaga e o currículo do corpo da requisição
    const { jobDescription, userCv } = request.body;

    // Validação para garantir que os dados necessários foram enviados
    if (!jobDescription || !userCv) {
      return response.status(400).json({ error: 'Descrição da vaga e currículo são obrigatórios.' });
    }

    // Seleciona o modelo de IA que vamos usar
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // --- A Engenharia de Prompt ---
    const prompt = `
      Aja como um recrutador técnico especialista e consultor de carreira. Analise a DESCRIÇÃO DA VAGA e o CURRÍCULO DO CANDIDATO abaixo.

      **Descrição da Vaga:**
      \`\`\`
      ${jobDescription}
      \`\`\`

      **Currículo do Candidato:**
      \`\`\`
      ${userCv}
      \`\`\`

      Com base nos dois textos, retorne a sua análise estritamente no seguinte formato JSON, sem adicionar nenhum texto antes ou depois do JSON:
      {
        "analise_palavras_chave": ["Liste aqui 3 a 5 competências essenciais da vaga que não estão claras ou estão em falta no currículo."],
        "sugestao_resumo": "Escreva aqui um parágrafo de resumo de 3 a 4 linhas, em primeira pessoa, para o candidato usar, destacando as suas forças em relação à vaga.",
        "perguntas_entrevista": ["Gere aqui uma pergunta técnica relevante.", "Gere aqui uma pergunta comportamental relevante.", "Gere aqui uma terceira pergunta baseada num projeto ou experiência do currículo."]
      }
    `;

    // Envia o prompt para a IA e espera pela resposta
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    // Limpa a resposta da IA para garantir que é um JSON válido
    const cleanedJsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Tenta fazer o parse do JSON e se falhar, lança um erro claro.
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedJsonString);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON da IA:", cleanedJsonString, parseError);
      throw new Error("A IA retornou uma resposta em formato inválido.");
    }

    // Envia a resposta da IA de volta para o nosso front-end
    return response.status(200).json(jsonResponse);

  } catch (error: unknown) {
    // Se algo der errado, envia uma mensagem de erro detalhada e SEMPRE em formato JSON
    console.error("Erro no handler da API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido no servidor.';
    return response.status(500).json({ error: errorMessage });
  }
}
