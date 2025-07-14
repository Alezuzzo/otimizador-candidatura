import React from 'react';

function JobOptimizerForm() {
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
              />
            </div>
            <button
              type="button"
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors duration-300"
            >
              Analisar Candidatura
            </button>
          </div>

          {/* Coluna da Direita: Resultados */}
          <div className="bg-slate-800 p-6 rounded-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Análise da IA
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>Os resultados da sua análise aparecerão aqui...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobOptimizerForm;