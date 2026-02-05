'use client';

import { clients, getTotalRevenue, getActiveRevenue, getCompletedRevenue, getPipelineRevenue } from '@/data/clients';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SummaryCards() {
  const completedClients = clients.filter(c => c.status === 'completed').length;
  const almostCompleteClients = clients.filter(c => c.status === 'almost-complete').length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pipelineClients = clients.filter(c => c.status === 'pipeline').length;
  
  const almostCompleteRevenue = clients.filter(c => c.status === 'almost-complete').reduce((sum, c) => sum + c.revenue, 0);
  const activeOnlyRevenue = clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.revenue, 0);

  const cards = [
    {
      label: 'Total 2026',
      value: formatCurrency(getTotalRevenue()),
      subtext: `${clients.length} projects`,
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
      label: 'Completed',
      value: formatCurrency(getCompletedRevenue()),
      subtext: `${completedClients} done`,
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      label: 'Almost Done',
      value: formatCurrency(almostCompleteRevenue),
      subtext: `${almostCompleteClients} wrapping up`,
      color: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    },
    {
      label: 'Active',
      value: formatCurrency(activeOnlyRevenue),
      subtext: `${activeClients} in progress`,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      label: 'Leads',
      value: formatCurrency(getPipelineRevenue()),
      subtext: `${pipelineClients} prospects`,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.color} rounded-2xl p-5 text-white shadow-lg`}
        >
          <p className="text-sm font-medium opacity-90">{card.label}</p>
          <p className="text-2xl font-bold mt-1">{card.value}</p>
          <p className="text-sm mt-1 opacity-75">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
