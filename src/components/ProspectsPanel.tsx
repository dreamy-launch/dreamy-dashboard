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

export default function ProspectsPanel() {
  const pipelineClients = clients.filter(c => c.status === 'pipeline');
  const almostDoneClients = clients.filter(c => c.status === 'almost-complete');
  const completedClients = clients.filter(c => c.status === 'completed');
  
  const pipelineValue = getPipelineRevenue();
  const almostDoneValue = clients.filter(c => c.status === 'almost-complete').reduce((sum, c) => sum + c.revenue, 0);
  const completedValue = getCompletedRevenue();
  
  // Q1 2026 target
  const q1Target = 30000;
  const q1Progress = completedValue + almostDoneValue;
  const q1Percentage = Math.min(100, Math.round((q1Progress / q1Target) * 100));
  
  // Close rate: completed out of (completed + almost-done)
  const closeRate = completedClients.length + almostDoneClients.length > 0 
    ? Math.round((completedClients.length / (completedClients.length + almostDoneClients.length)) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">🎯 Goals</h2>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <span className="text-xs text-green-600 font-medium">Close Rate</span>
          <p className="text-xl font-bold text-green-700">{closeRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
          <span className="text-xs text-purple-600 font-medium">Leads</span>
          <p className="text-xl font-bold text-purple-700">{pipelineClients.length}</p>
        </div>
      </div>

      {/* Q1 Target Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Q1 Target</span>
          <span className="text-xs text-gray-500">
            {formatCurrency(q1Progress)} / {formatCurrency(q1Target)}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              q1Percentage >= 100
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : q1Percentage >= 75
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                : 'bg-gradient-to-r from-purple-400 to-violet-500'
            }`}
            style={{ width: `${q1Percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{q1Percentage}%</span>
          {q1Percentage >= 100 && <span className="text-xs text-green-600 font-medium">🎉 Hit!</span>}
        </div>
      </div>

      {/* Hot Leads */}
      {pipelineClients.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">🔥 Hot Leads</h3>
          <div className="space-y-2">
            {pipelineClients.map((client, idx) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                </div>
                <p className="font-semibold text-purple-700 text-sm">{formatCurrency(client.revenue)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Lead Value</span>
              <span className="font-semibold text-purple-700">{formatCurrency(pipelineValue)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Achievement */}
      {completedClients.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            🏆 {completedClients.length} project{completedClients.length > 1 ? 's' : ''} shipped!
          </span>
        </div>
      )}
    </div>
  );
}
