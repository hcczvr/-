import React, { useState, useCallback } from 'react';
import { CategorizedResults, DifficultyLevel, SearchStatus } from './types';
import { fetchWords } from './services/geminiService';
import WordList from './components/WordList';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.PRIMARY);
  const [results, setResults] = useState<CategorizedResults | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;

    setStatus('loading');
    setErrorMessage('');
    setResults(null);

    try {
      const data = await fetchWords(input, difficulty);
      setResults(data);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setStatus('error');
    }
  }, [input, difficulty]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'LexiFind - English Word Pattern Search',
      text: 'Check out this tool to find English words based on letter combinations!',
      url: url,
    };

    // 1. Try Native Web Share API (Mobile/Supported Browsers)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // User cancelled or error, fall through to clipboard method
        if ((error as Error).name === 'AbortError') return;
      }
    }

    // 2. Try Clipboard API
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // 3. Fallback for restricted environments (iframe/preview)
      // If clipboard access is denied, show a prompt for manual copy
      window.prompt("Copy this link to share:", url);
    }
  };

  // Icons
  const StartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 010 1.06l-4.75 4.75a.75.75 0 01-1.06-1.06L9.69 14H2.25a.75.75 0 010-1.5h7.44l-2.22-2.22a.75.75 0 111.06-1.06l4.75 4.75zM12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0v-18a.75.75 0 01.75-.75zM15 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0v-18a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  );

  const MiddleIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M4.5 9.75a.75.75 0 000 1.5h15a.75.75 0 000-1.5H4.5z" />
      <path d="M4.5 12.75a.75.75 0 000 1.5h15a.75.75 0 000-1.5H4.5z" />
      <path fillRule="evenodd" d="M10.5 4.5a1.5 1.5 0 00-3 0v15a1.5 1.5 0 003 0V4.5zm4.5 0a1.5 1.5 0 00-3 0v15a1.5 1.5 0 003 0V4.5z" clipRule="evenodd" />
    </svg>
  );

  const EndIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10.72 11.47a.75.75 0 000 1.06l4.75 4.75a.75.75 0 001.06-1.06L14.31 14h7.44a.75.75 0 000-1.5h-7.44l2.22-2.22a.75.75 0 00-1.06-1.06l-4.75 4.75zM2.25 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0v-18a.75.75 0 01.75-.75zM5.25 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0v-18a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 sm:px-6 relative">
      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 text-sm hover:text-blue-600 hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 z-10"
        aria-label="Share application"
        title="Share this app"
      >
        {copySuccess ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-medium">Copied!</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
            </svg>
            <span>Share</span>
          </>
        )}
      </button>

      <header className="mb-8 text-center max-w-2xl w-full">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">LexiFind</h1>
        <p className="text-slate-600">Enter a letter combination (e.g., "th", "ing") to discover words across different difficulty levels.</p>
      </header>

      <main className="w-full max-w-6xl">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
            
            {/* Input Group */}
            <div className="flex-1 w-full">
              <label htmlFor="pattern" className="block text-sm font-medium text-slate-700 mb-1">
                Letter Combination
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="pattern"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. cu, th, ing"
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 border p-3 pl-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-lg"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="w-full md:w-auto min-w-[200px]">
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">
                Vocabulary Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="block w-full rounded-lg border-slate-300 bg-slate-50 border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base cursor-pointer"
              >
                <option value={DifficultyLevel.PRIMARY}>Primary School</option>
                <option value={DifficultyLevel.MIDDLE}>Middle School</option>
                <option value={DifficultyLevel.HIGH}>High School</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || !input.trim()}
              className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === 'loading' ? (
                 <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Searching...
                 </span>
              ) : (
                'Find Words'
              )}
            </button>
          </form>
        </section>

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Results Grid */}
        {status === 'success' && results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WordList 
              title="Starts With" 
              words={results.start} 
              colorClass="bg-emerald-500" 
              icon={StartIcon}
            />
            <WordList 
              title="Contains Middle" 
              words={results.middle} 
              colorClass="bg-indigo-500" 
              icon={MiddleIcon}
            />
            <WordList 
              title="Ends With" 
              words={results.end} 
              colorClass="bg-rose-500" 
              icon={EndIcon}
            />
          </div>
        )}

        {/* Empty State / Initial Instructions */}
        {status === 'idle' && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to search?</h3>
              <p className="text-slate-500">
                Enter a prefix, suffix, or any letter combination above and select a difficulty level to see categorized word lists with pronunciation guides.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-12 text-slate-400 text-sm">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;