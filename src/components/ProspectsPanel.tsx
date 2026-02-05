'use client';

import { clients, getCashCollected, getBalanceDue, getPipelineValue, getWaitingOnClientRevenue } from '@/data/clients';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProspectsPanel() {
  const cashCollected = getCashCollected();
  const balanceDue = getBalanceDue();
  const waitingOnClient = getWaitingOnClientRevenue();
  const pipelineValue = getPipelineValue();
  
  // Q1 2026 target (cash collected)
  const q1Target = 25000;
  const q1Percentage = Math.min(100, Math.round((cashCollected / q1Target) * 100));
  
  // Money to chase
  const toChase = waitingOnClient;
  
  const completedProjects = clients.filter(c => c.projectStatus === 'completed').length;
  const waitingProjects = clients.filter(c => c.projectStatus === 'waiting-on-client').length;
  const leads = clients.filter(c => c.paymentStatus === 'unpaid');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">🎯 Goals & Actions</h2>

      {/* Q1 Cash Target */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Q1 Cash Target</span>
          <span className="text-xs text-gray-500">
            {formatCurrency(cashCollected)} / {formatCurrency(q1Target)}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              q1Percentage >= 100
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : q1Percentage >= 75
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                : 'bg-gradient-to-r from-violet-400 to-purple-500'
            }`}
            style={{ width: `${q1Percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{q1Percentage}% collected</span>
      </div>

      {/* Money to Chase */}
      {toChase > 0 && (
        <div className="mb-5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium">💸 To Collect</p>
              <p className="text-2xl font-bold text-amber-700">{formatCurrency(toChase)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-600">{waitingProjects} projects</p>
              <p className="text-xs text-amber-500">waiting on client</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
          <p className="text-2xl font-bold text-green-700">{completedProjects}</p>
          <p className="text-xs text-green-600">Shipped</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
          <p className="text-2xl font-bold text-purple-700">{leads.length}</p>
          <p className="text-xs text-purple-600">Leads</p>
        </div>
      </div>

      {/* Pipeline Value */}
      {pipelineValue > 0 && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-600">Pipeline Value</span>
            <span className="font-bold text-purple-700">{formatCurrency(pipelineValue)}</span>
          </div>
          <div className="mt-2 space-y-1">
            {leads.map((lead) => (
              <div key={lead.id} className="flex justify-between text-xs">
                <span className="text-gray-600">{lead.name}</span>
                <span className="text-purple-600">{formatCurrency(lead.totalRevenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
