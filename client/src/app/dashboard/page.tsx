'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { Loader2, Flame, TrendingUp, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [terminalId, setTerminalId] = useState('LOADING...');

  useEffect(() => {
    // Generate ID on client only to prevent hydration mismatch
    setTerminalId(Math.random().toString(36).substr(2, 9).toUpperCase());

    // Mock user ID for now
    api.get('/user/stats', { headers: { 'x-user-id': 'demo-user-id' } }) // pass mock id
      .then(res => setStats(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <> <Header /> <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-terminal-green" size={40} /></div> </>;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6 w-full font-mono">
        <div className="mb-8 border-b border-terminal-green/30 pb-4">
          <h1 className="text-4xl font-primary text-terminal-green tracking-tighter">
            &gt; SYSTEM_STATUS
          </h1>
          <p className="text-gray-500 text-sm font-terminal uppercase tracking-widest mt-1">
                // USER: RAMAKRSNA // ID: {terminalId}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="STREAK_STATUS" value={stats?.currentStreak || 0} suffix="DAYS" />
          <StatCard title="TOTAL_CLEARED" value={stats?.totalSolved || 0} suffix="QNS" />
          <StatCard title="MAX_STREAK" value={stats?.longestStreak || 0} suffix="DAYS" />
        </div>

        {/* Console Box */}
        <div className="border border-white/20 bg-black p-6 relative">
          <div className="absolute top-0 left-0 bg-white/20 px-2 py-0.5 text-xs text-white font-bold uppercase tracking-widest">
            TOPIC_MASTERY_V1.0
          </div>
          <div className="mt-6 h-80 w-full">
            {stats?.topicMastery && stats.topicMastery.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topicMastery}>
                  <XAxis dataKey="name" stroke="#00FF9C" fontSize={12} tickLine={false} axisLine={false} fontFamily="Share Tech Mono" />
                  <YAxis stroke="#00FF9C" fontSize={12} tickLine={false} axisLine={false} fontFamily="Share Tech Mono" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF9C', borderRadius: '0px' }}
                    itemStyle={{ color: '#00FF9C', fontFamily: 'VT323' }}
                    cursor={{ fill: 'rgba(0, 255, 156, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#00FF9C" barSize={20} shape={<CustomBar />} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 font-terminal uppercase">
                [ NO_DATA_DETECTED ]
              </div>
            )}
          </div>

          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-terminal-green"></div>
        </div>
      </main>
    </>
  );
}

const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} />;
};

function StatCard({ title, value, suffix }: any) {
  return (
    <div className="border border-white/20 p-6 bg-black relative group hover:border-terminal-green transition-colors">
      <div className="text-gray-500 text-xs font-bold tracking-widest mb-2 uppercase group-hover:text-terminal-green">
        {title}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-primary text-white">{value}</div>
        <div className="text-sm font-terminal text-gray-600 uppercase">{suffix}</div>
      </div>

      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-scanner opacity-0 group-hover:opacity-10 pointer-events-none"></div>
    </div>
  )
}
