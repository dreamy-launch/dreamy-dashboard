export type ClientStatus = 'active' | 'completed' | 'almost-complete' | 'pipeline';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  revenue: number;
  currency: 'NZD' | 'AUD';
  startDate: string;
  endDate?: string;
  projectType: 'landing-page' | 'full-site' | 'maintenance' | 'redesign';
  source: string;
  notes?: string;
}

// 2026 Client Data
export const clients: Client[] = [
  // January - Completed/Almost Complete
  {
    id: '1',
    name: 'Ascension RCA',
    status: 'completed',
    revenue: 7500,
    currency: 'NZD',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Finished'
  },
  {
    id: '2',
    name: 'Jimmy Bull Construction',
    status: 'almost-complete',
    revenue: 7500,
    currency: 'NZD',
    startDate: '2026-01-10',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Almost Complete'
  },
  {
    id: '3',
    name: 'Procon',
    status: 'almost-complete',
    revenue: 2500,
    currency: 'NZD',
    startDate: '2026-01-15',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Almost Complete'
  },
  {
    id: '4',
    name: 'Jay Lash',
    status: 'almost-complete',
    revenue: 2500,
    currency: 'NZD',
    startDate: '2026-01-20',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Feb completion'
  },
  // Active
  {
    id: '5',
    name: "Let's Go Website",
    status: 'active',
    revenue: 8750,
    currency: 'AUD',
    startDate: '2026-02-01',
    projectType: 'full-site',
    source: 'Direct',
    notes: '$8750 AUD'
  },
  // Leads / Pipeline
  {
    id: '6',
    name: 'Ben Roofing',
    status: 'pipeline',
    revenue: 750,
    currency: 'NZD',
    startDate: '2026-02-15',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Landing Page'
  },
  {
    id: '7',
    name: 'Ben Cladding',
    status: 'pipeline',
    revenue: 750,
    currency: 'NZD',
    startDate: '2026-02-15',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Landing Page'
  },
  {
    id: '8',
    name: 'Sam - Pacman Trees',
    status: 'pipeline',
    revenue: 1500,
    currency: 'NZD',
    startDate: '2026-02-20',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Landing Page'
  }
];

export function getClientsByStatus(status: ClientStatus): Client[] {
  return clients.filter(c => c.status === status);
}

export function getTotalRevenue(): number {
  return clients.reduce((sum, c) => sum + c.revenue, 0);
}

export function getCompletedRevenue(): number {
  return clients.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.revenue, 0);
}

export function getActiveRevenue(): number {
  return clients.filter(c => c.status === 'active' || c.status === 'almost-complete').reduce((sum, c) => sum + c.revenue, 0);
}

export function getPipelineRevenue(): number {
  return clients.filter(c => c.status === 'pipeline').reduce((sum, c) => sum + c.revenue, 0);
}

export function getMonthlyRevenue(): { month: string; revenue: number; cumulative: number }[] {
  const months: { [key: string]: number } = {};
  
  clients.forEach(client => {
    if (client.status === 'completed' || client.status === 'active' || client.status === 'almost-complete') {
      const date = new Date(client.startDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + client.revenue;
    }
  });

  const sortedMonths = Object.keys(months).sort();
  let cumulative = 0;
  
  return sortedMonths.map(month => {
    cumulative += months[month];
    const [year, m] = month.split('-');
    const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-NZ', { month: 'short', year: '2-digit' });
    return {
      month: monthName,
      revenue: months[month],
      cumulative
    };
  });
}
