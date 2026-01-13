'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import CompanyCard from '@/components/CompanyCard';
import api from '@/lib/api';
import { Search, Loader2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  _count: { questions: number };
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('company'); // 'company', 'topic', 'question'
  const [loading, setLoading] = useState(true);

  // Debouce Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, searchType]);

  const fetchCompanies = () => {
    setLoading(true);
    // Don't modify api.ts, simply use params
    api.get(`/companies?type=${searchType}&query=${search}`)
      .then(res => setCompanies(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };


  return (
    <>
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full font-mono">
        <div className="mb-12 text-center pt-8 border-b border-white/10 pb-8">
          <h1 className="text-6xl md:text-8xl mb-4 font-primary text-white tracking-tighter animate-pulse">
            SELECT_TARGET
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-terminal tracking-widest uppercase">
             // AWAITING INPUT...
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          {/* Search Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold tracking-widest">
            {['company', 'topic', 'question'].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 border uppercase transition-all ${searchType === type
                    ? 'bg-terminal-green text-black border-terminal-green'
                    : 'bg-black text-gray-500 border-gray-800 hover:text-white hover:border-white'
                  }`}
              >
                [{type.toUpperCase()}]
              </button>
            ))}
          </div>

          {/* Terminal Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-terminal-green font-bold">
              &gt;_
            </div>
            <input
              type="text"
              placeholder={
                searchType === 'company' ? "ENTER TARGET CORP..." :
                  searchType === 'topic' ? "ENTER DATA STRUCTURE..." : "ENTER ALGORITHM..."
              }
              className="w-full bg-black border-2 border-white/20 py-4 pl-12 pr-6 text-xl font-terminal text-terminal-green placeholder-gray-700 outline-none focus:border-terminal-green transition-all uppercase"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />

            {/* Search Status Indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {loading ? (
                <span className="text-terminal-green animate-bounce">SCANNING...</span>
              ) : (
                <span className="text-gray-700 text-xs text-xs font-terminal">READY</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {companies.map(c => <CompanyCard key={c.id} company={c} />)}
          {companies.length === 0 && !loading && (
            <div className="col-span-full text-center text-red-500 font-terminal text-xl py-12 border border-red-900/50 bg-red-900/10 p-8">
              [ERROR]: TARGET NOT FOUND
            </div>
          )}
        </div>
      </main>
    </>
  );
}
