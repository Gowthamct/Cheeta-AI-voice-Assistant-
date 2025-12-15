import React, { useState, useEffect } from 'react';
import CheetaInterface from './components/CheetaInterface';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | undefined>(process.env.API_KEY);
  const [loading, setLoading] = useState(true);
  const [keyError, setKeyError] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // 1. Check if env var is already there (local dev)
      if (process.env.API_KEY) {
        setApiKey(process.env.API_KEY);
        setLoading(false);
        return;
      }

      // 2. Check aistudio selection (embedded environment)
      // Cast window to any to avoid TypeScript conflict with existing global types
      const win = window as any;
      if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (hasKey) {
          // If true, the key is injected into process.env.API_KEY by the environment automatically
           setApiKey(process.env.API_KEY); 
           setLoading(false);
        } else {
            setKeyError(true);
            setLoading(false);
        }
      } else {
        // Fallback for environment without aistudio helper
        setKeyError(true);
        setLoading(false);
      }
    };

    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio) {
        await win.aistudio.openSelectKey();
        // Assume success after dialog interaction per guidelines
        setKeyError(false);
        setApiKey(process.env.API_KEY); 
        window.location.reload(); // Reload to ensure env vars are picked up if needed
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-orbitron animate-pulse">
            INITIALIZING SYSTEM...
        </div>
    );
  }

  if (keyError && !apiKey) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 font-rajdhani p-6 text-center">
            <h1 className="text-3xl font-orbitron mb-4 text-red-500">ACCESS DENIED</h1>
            <p className="mb-8 text-lg max-w-md">API Key Authorization Required. Please select a paid GCP project to enable Cheeta Voice Assistant.</p>
            
            <button 
                onClick={handleSelectKey}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_20px_#06b6d4] transition-all"
            >
                SELECT API KEY
            </button>
            
            <p className="mt-8 text-sm text-slate-500">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">
                    View Billing Documentation
                </a>
            </p>
        </div>
    );
  }

  return <CheetaInterface apiKey={apiKey} />;
};

export default App;