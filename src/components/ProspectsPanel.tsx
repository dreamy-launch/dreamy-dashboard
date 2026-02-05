'use client';

import { clients, getPipelineRevenue, getActiveRevenue, getCompletedRevenue } from '@/data/clients';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Gamification: Calculate win rate and streaks
const getWinRate = () => {
  const completed = clients.filter(c => c.status === 'completed').length;
  const total = clients.filter(c => c.status !== 'pipeline').length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

const getConversionRate = () => {
  const won = clients.filter(c => c.status === 'completed' || c.status === 'active').length;
  const total = clients.length;
  return total > 0 ? Math.round((won / total) * 100) : 0;
};

export default function ProspectsPanel() {
  const pipelineClients = clients.filter(c => c.status === 'pipeline');
  const pipelineValue = getPipelineRevenue();
  const activeValue = getActiveRevenue();
  const completedValue = getCompletedRevenue();
  
  // Q1 2026 target
  const q1Target = 50000;
  const q1Progress = completedValue + activeValue;
  const q1Percentage = Math.min(100, Math.round((q1Progress / q1Target) * 100));
  
  // Annual target
  const annualTarget = 150000;
  const totalPipeline = pipelineValue + activeValue + completedValue;
  const annualPercentage = Math.min(100, Math.round((totalPipeline / annualTarget) * 100));

  const winRate = getWinRate();
  const conversionRate = getConversionRate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">🎯 Pipeline & Goals</h2>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
          {pipelineClients.length} prospects
        </span>
      </div>

      {/* Gamified Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏆</span>
            <span className="text-xs text-green-600 font-medium">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{winRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <span className="text-xs text-blue-600 font-medium">Conversion</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{conversionRate}%</p>
        </div>
      </div>

      {/* Q1 Target Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Q1 2026 Target</span>
          <span className="text-sm text-gray-500">
            {formatCurrency(q1Progress)} / {formatCurrency(q1Target)}
          </span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              q1Percentage >= 100
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : q1Percentage >= 75
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                : q1Percentage >= 50
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-gradient-to-r from-purple-400 to-violet-500'
            }`}
            style={{ width: `${q1Percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{q1Percentage}% complete</span>
          {q1Percentage >= 100 && <span className="text-xs text-green-600 font-medium">🎉 Target hit!</span>}
        </div>
      </div>

      {/* Annual Target Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">2026 Pipeline</span>
          <span className="text-sm text-gray-500">
            {formatCurrency(totalPipeline)} / {formatCurrency(annualTarget)}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${annualPercentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{annualPercentage}% of annual target</span>
      </div>

      {/* Hot Prospects */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">🔥 Hot Prospects</h3>
        <div className="space-y-2">
          {pipelineClients.slice(0, 4).map((client, idx) => (
            <div
              key={client.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.source}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-700 text-sm">{formatCurrency(client.revenue)}</p>
                <p className="text-xs text-gray-500">{client.projectType.replace('-', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      {(completedValue >= 10000 || clients.length >= 10) && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-3">🏅 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {completedValue >= 10000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                💰 $10K Club
              </span>
            )}
            {clients.length >= 10 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                👥 10 Clients
              </span>
            )}
            {winRate >= 50 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                🎯 50%+ Win Rate
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
