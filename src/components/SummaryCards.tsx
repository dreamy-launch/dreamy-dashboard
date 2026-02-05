'use client';

import { clients, getCashCollected, getBalanceDue, getTotalContractValue, getPipelineValue, getWaitingOnClientRevenue } from '@/data/clients';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SummaryCards() {
  const cashCollected = getCashCollected();
  const balanceDue = getBalanceDue();
  const waitingOnClient = getWaitingOnClientRevenue();
  const pipelineValue = getPipelineValue();
  
  const paidProjects = clients.filter(c => c.paymentStatus === 'paid-in-full').length;
  const waitingProjects = clients.filter(c => c.projectStatus === 'waiting-on-client').length;
  const activeProjects = clients.filter(c => c.projectStatus === 'active' && c.paymentStatus !== 'unpaid').length;
  const leads = clients.filter(c => c.paymentStatus === 'unpaid').length;

  const cards = [
    {
      label: '💰 Cash Collected',
      value: formatCurrency(cashCollected),
      subtext: 'In the bank',
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      label: '⏳ Balance Due',
      value: formatCurrency(waitingOnClient),
      subtext: `${waitingProjects} waiting on client`,
      color: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    },
    {
      label: '🔵 Active Work',
      value: formatCurrency(clients.filter(c => c.projectStatus === 'active' && c.paymentStatus === 'deposit-paid').reduce((s,c) => s + c.totalRevenue, 0)),
      subtext: `${activeProjects} in progress`,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      label: '🟣 Pipeline',
      value: formatCurrency(pipelineValue),
      subtext: `${leads} leads`,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
    },
    {
      label: '📊 Total 2026',
      value: formatCurrency(getTotalContractValue()),
      subtext: `${clients.length} projects`,
      color: 'bg-gradient-to-br from-gray-700 to-gray-900',
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
