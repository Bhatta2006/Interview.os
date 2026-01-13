'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { CheckCircle2, Circle, ExternalLink, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface Question {
  id: string;
  title: string;
  frequency: string;
  topic: string;
  leetcodeUrl: string;
  progress?: { status: string }[];
}

export default function CompanyDetail({ id }: { id: string }) {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortOrder, setSortOrder] = useState<'freq-desc' | 'freq-asc'>('freq-desc');

  useEffect(() => {
    api.get(`/companies/${id}`)
      .then(res => setCompany(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Header />
      <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
    </>
  );

  if (!company) return (
    <>
      <Header />
      <div className="text-center p-20 text-xl text-gray-400">Company not found</div>
    </>
  );

  // Extract unique topics
  const allTopics = company.questions ? Array.from(new Set(company.questions.map((q: Question) => q.topic.split(', ')).flat())) : [];
  const uniqueTopics = ['All', ...allTopics.sort()];

  // Filter and Sort
  const filteredQuestions = company.questions?.filter((q: Question) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || q.topic.includes(selectedTopic);
    return matchesSearch && matchesTopic;
  }).sort((a: Question, b: Question) => {
    const freqA = parseFloat(a.frequency) || 0;
    const freqB = parseFloat(b.frequency) || 0;
    return sortOrder === 'freq-desc' ? freqB - freqA : freqA - freqB;
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6 w-full font-mono">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-terminal-green mb-8 transition-colors uppercase tracking-widest text-sm font-bold">
          <ArrowLeft size={16} className="mr-2" /> [ BACK_TO_BASE ]
        </Link>

        <div className="border-b border-terminal-green/30 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-primary text-white tracking-tighter mb-2 uppercase">
              &gt; {company.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-terminal text-gray-400">
              <span>// TARGET_ID: {company.id?.substring(0, 8).toUpperCase()}</span>
              <span className="text-terminal-green">
                [{filteredQuestions?.length || 0} / {company.questions?.length || 0} SECTORS_CLEARED]
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="SEARCH_LOGS..."
              className="bg-black border border-white/20 px-4 py-2 text-sm text-white placeholder-gray-700 outline-none focus:border-terminal-green uppercase font-terminal w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="bg-black border border-white/20 px-4 py-2 text-sm text-white outline-none focus:border-terminal-green uppercase font-terminal cursor-pointer"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {uniqueTopics.map((t: any) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* ASCII TAbLE */}
        <div className="border border-white/20 bg-black">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/20 bg-white/5 text-xs font-bold text-terminal-green tracking-widest uppercase font-terminal">
            <div className="col-span-1 text-center">[S]</div>
            <div className="col-span-6">TARGET_QUESTION</div>
            <div className="col-span-3">CLASS</div>
            <div className="col-span-1">PRIORITY</div>
            <div className="col-span-1 text-center">LINK</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredQuestions?.map((q: Question) => (
              <QuestionRow key={q.id} question={q} />
            ))}
            {(!filteredQuestions || filteredQuestions.length === 0) && (
              <div className="p-8 text-center text-red-500 font-terminal border border-red-900/30 m-4 bg-red-900/10">
                [NULL_POINTER_EXCEPTION]: NO_DATA_FOUND
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function QuestionRow({ question }: { question: Question }) {
  const isDone = question.progress?.[0]?.status === 'DONE';
  const [done, setDone] = useState(isDone);

  const toggle = () => {
    const newStatus = !done;
    setDone(newStatus);
    api.post('/user/progress', { questionId: question.id, status: newStatus ? 'DONE' : 'PENDING' })
      .catch(e => {
        console.error(e);
        setDone(!newStatus); // Revert on error
      });
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-white/5 transition-colors group font-terminal text-sm border-l-2 border-transparent hover:border-terminal-green">
      <div className="col-span-2 md:col-span-1 flex justify-center">
        <button
          onClick={toggle}
          className={clsx(
            "w-6 h-6 flex items-center justify-center border transition-colors",
            done ? "border-terminal-green bg-terminal-green text-black" : "border-gray-600 hover:border-white text-transparent"
          )}
        >
          {done ? 'X' : ''}
        </button>
      </div>
      <div className="col-span-8 md:col-span-6 text-gray-300 font-mono uppercase truncate">
        {question.title}
      </div>
      <div className="col-span-3 hidden md:block text-xs text-gray-500 uppercase truncate">
        {question.topic}
      </div>
      <div className="col-span-1 hidden md:block text-xs">
        <span className={clsx(
          "px-1",
          parseFloat(question.frequency) > 80 ? "text-red-500 font-bold" : "text-gray-500"
        )}>
          {(parseFloat(question.frequency) || 0).toFixed(0)}%
        </span>
      </div>
      <div className="col-span-2 md:col-span-1 flex justify-center">
        <a
          href={question.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-terminal-green transition-colors"
          title="JACK_IN"
        >
          [&gt;]
        </a>
      </div>
    </div>
  )
}
