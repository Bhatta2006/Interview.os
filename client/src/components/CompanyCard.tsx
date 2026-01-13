import Link from 'next/link';
import { Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  _count?: {
    questions: number;
  };
  solvedCount?: number;
}

export default function CompanyCard({ company }: { company: Company }) {
  const total = company._count?.questions || 0;
  const solved = company.solvedCount || 0;
  const progress = total > 0 ? (solved / total) * 100 : 0;

  // Calculate ASCII blocks (10 blocks total)
  const blocks = Math.round(progress / 10);
  const filled = '█'.repeat(blocks);
  const empty = '░'.repeat(10 - blocks);

  return (
    <Link
      href={`/company/${company.id}`}
      className="group block p-4 border border-white/20 bg-black hover:border-terminal-green transition-all relative overflow-hidden font-mono"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-terminal-green uppercase tracking-wider font-primary truncate pr-2">
          &gt; {company.name}
        </h3>
        <Building2 size={20} className="text-gray-600 group-hover:text-terminal-green transition-colors" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 font-terminal">
          <span>TARGET_DATA:</span>
          <span>{solved}/{total} CLEARED</span>
        </div>

        <div className="text-terminal-green text-xs tracking-widest">
          [{filled}{empty}] {Math.round(progress)}%
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-terminal-green transition-colors"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-terminal-green transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-terminal-green transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-terminal-green transition-colors"></div>
    </Link>
  );
}
