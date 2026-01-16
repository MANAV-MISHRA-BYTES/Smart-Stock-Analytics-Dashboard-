
import React, { useState, useEffect, useCallback } from 'react';
import { StockData } from './types';
import { fetchStockAnalytics } from './services/geminiService';
import MetricsCard from './components/MetricsCard';
import DashboardCharts from './components/DashboardCharts';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('AAPL');
  const [inputVal, setInputVal] = useState('AAPL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);

  const loadData = useCallback(async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStockAnalytics(symbol);
      setStockData(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data for " + symbol + ". Check your API key or symbol.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchTerm(inputVal.toUpperCase());
      loadData(inputVal.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">QuantPulse</h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Smart Analytics Engine</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search ticker (e.g. NVDA, TSLA)..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-full py-2.5 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all group-hover:border-slate-600"
            />
            <svg className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Scanning the markets for {searchTerm}...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-white font-bold text-lg mb-2">Analysis Interrupted</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <button onClick={() => loadData(searchTerm)} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
              Retry Sync
            </button>
          </div>
        ) : stockData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stock Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-slate-800/20 p-8 rounded-3xl border border-slate-800 shadow-2xl">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-md font-mono border border-blue-500/20">
                    {stockData.symbol}
                  </span>
                  <h1 className="text-4xl font-black text-white">{stockData.name}</h1>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-mono font-bold text-white">{stockData.price}</span>
                  <div className={`flex items-center gap-1 font-bold ${parseFloat(stockData.change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <svg className={`w-5 h-5 ${parseFloat(stockData.change) >= 0 ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{stockData.change} ({stockData.changePercent})</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Market Segment</p>
                  <p className="text-white font-semibold">Technology / AI</p>
                </div>
                <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Exchange</p>
                  <p className="text-white font-semibold">NASDAQ Global Select</p>
                </div>
              </div>
            </div>

            {/* Smart Insights Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1 bg-blue-500 rounded text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  <h3 className="font-bold text-blue-100 uppercase text-xs tracking-widest">Smart Market Analysis</h3>
                </div>
                <p className="text-blue-100/90 leading-relaxed max-w-4xl text-sm italic">
                  "{stockData.smartAnalysis}"
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stockData.metrics.map((m, i) => (
                <MetricsCard key={i} label={m.label} value={m.value} />
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardCharts data={stockData.salesData} />
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Latest Market News
                </h3>
                <div className="space-y-4 overflow-y-auto pr-2 max-h-[400px]">
                  {stockData.news.map((news, i) => (
                    <a 
                      key={i} 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{news.source}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{news.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mb-2 leading-snug group-hover:text-white">{news.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{news.summary}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Corporate Structure & Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ownership Structure</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">Parent Entity</span>
                    <span className="text-white font-medium">{stockData.parentCompany}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">Holding/Subsidiaries</span>
                    <span className="text-white font-medium">{stockData.holdingCompany}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 text-sm">Bond Yields/Credit</span>
                    <span className="text-white font-medium">{stockData.bondYields}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {stockData.groundingSources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                    >
                      {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                    </a>
                  ))}
                  {stockData.groundingSources.length === 0 && <span className="text-slate-500 text-xs italic">Sourced via Gemini Knowledge Base</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-xs">
          QuantPulse &copy; {new Date().getFullYear()} &bull; Real-time data powered by Gemini 3 Flash & Google Search &bull; Not financial advice.
        </p>
      </footer>
    </div>
  );
};

export default App;
