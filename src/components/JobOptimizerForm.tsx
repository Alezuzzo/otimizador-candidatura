import React, { useState } from 'react';

// Define a "forma" (type) que os nossos resultados terão
type AnalysisResult = {
  analise_palavras_chave: string[];
  sugestao_resumo: string;
  perguntas_entrevista: string[];
};

function JobOptimizerForm() {
  const [jobDescription, setJobDescription] = useState('');
  const [userCv, setUserCv] = useState('');
  
  // --- Nossos novos estados ---
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeClick = async () => {
    // Reseta os estados anteriores e inicia o loading
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // Faz a chamada de API para o nosso backend
      const response = await fetch('/api/analisar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, userCv }),
      });

      // Se a resposta não for "OK" (ex: erro 400 ou 500), lança um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ocorreu um erro na resposta da API.');
      }

      // Se tudo correu bem, guarda o resultado
      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

    } catch (err: any) {
      // Se ocorrer um erro na chamada, guarda a mensagem de erro
      setError(err.message || 'Falha ao conectar com o servidor.');
    } finally {
      // Independentemente do resultado, para o loading
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna da Esquerda: Formulários */}
          <div className="space-y-6">
            <div>
              <label htmlFor="job-description" className="block text-sm font-medium text-slate-300 mb-2">
                Cole a Descrição da Vaga
              </label>
              <textarea
                id="job-description"
                rows={10}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Ex: Procuramos um desenvolvedor React com 3 anos de experiência..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading} // Desabilita enquanto carrega
              />
            </div>
            <div>
              <label htmlFor="user-cv" className="block text-sm font-medium text-slate-300 mb-2">
                Cole o seu Currículo ou Resumo
              </label>
              <textarea
                id="user-cv"
                rows={10}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Ex: Desenvolvedor Front-end com experiência em React, TypeScript..."
                value={userCv}
                onChange={(e) => setUserCv(e.target.value)}
                disabled={isLoading} // Desabilita enquanto carrega
              />
            </div>
            <button
              type="button"
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
              onClick={handleAnalyzeClick}
              disabled={isLoading || !jobDescription || !userCv} // Desabilita enquanto carrega ou se os campos estiverem vazios
            >
              {isLoading ? 'Analisando...' : 'Analisar Candidatura'}
            </button>
          </div>

          {/* Coluna da Direita: Resultados */}
          <div className="bg-slate-800 p-6 rounded-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Análise da IA
            </h2>
            <div className="space-y-6 text-slate-300">
              {/* --- Exibição condicional dos resultados, loading ou erro --- */}
              {isLoading && (
                <div className="flex justify-center items-center">
                  <p>Aguarde, a IA está a pensar...</p>
                </div>
              )}
              {error && (
                <div className="text-red-400 bg-red-900/50 p-3 rounded-md">
                  <p className="font-bold">Ocorreu um erro:</p>
                  <p>{error}</p>
                </div>
              )}
              {analysisResult && (
                <>
                  <div>
                    <h3 className="font-bold text-sky-400 mb-2">Pontos a Melhorar no CV:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysisResult.analise_palavras_chave.map((keyword, index) => (
                        <li key={index}>{keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-sky-400 mb-2">Sugestão de Resumo:</h3>
                    <p className="bg-slate-700/50 p-3 rounded-md italic">{analysisResult.sugestao_resumo}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sky-400 mb-2">Possíveis Perguntas na Entrevista:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysisResult.perguntas_entrevista.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {!isLoading && !analysisResult && !error && (
                <p>Os resultados da sua análise aparecerão aqui...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobOptimizerForm;
