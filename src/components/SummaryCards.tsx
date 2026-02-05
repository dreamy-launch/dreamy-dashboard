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
  const activeClients = clients.filter(c => c.status === 'active').length;
  const completedClients = clients.filter(c => c.status === 'completed').length;
  const pipelineClients = clients.filter(c => c.status === 'pipeline').length;

  const cards = [
    {
      label: 'Total Pipeline',
      value: formatCurrency(getTotalRevenue()),
      subtext: `${clients.length} clients`,
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
      label: 'Completed',
      value: formatCurrency(getCompletedRevenue()),
      subtext: `${completedClients} projects`,
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      label: 'In Progress',
      value: formatCurrency(getActiveRevenue()),
      subtext: `${activeClients} active`,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      label: 'Pipeline',
      value: formatCurrency(getPipelineRevenue()),
      subtext: `${pipelineClients} prospects`,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.color} rounded-2xl p-6 text-white shadow-lg`}
        >
          <p className="text-sm font-medium opacity-90">{card.label}</p>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
          <p className="text-sm mt-1 opacity-75">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
