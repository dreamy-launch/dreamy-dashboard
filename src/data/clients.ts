export type ClientStatus = 'active' | 'completed' | 'on-hold' | 'pipeline';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  revenue: number;
  startDate: string;
  endDate?: string;
  projectType: 'landing-page' | 'full-site' | 'maintenance' | 'redesign';
  source: string;
  notes?: string;
}

// Seeded from Notion pipeline data
export const clients: Client[] = [
  {
    id: '1',
    name: 'DW Homes',
    status: 'active',
    revenue: 7500,
    startDate: '2025-11-15',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Full website build'
  },
  {
    id: '2',
    name: 'Ramsay Builders',
    status: 'active',
    revenue: 7500,
    startDate: '2025-12-01',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Website redesign'
  },
  {
    id: '3',
    name: 'GK Construction',
    status: 'active',
    revenue: 2500,
    startDate: '2026-01-10',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Landing page'
  },
  {
    id: '4',
    name: 'RODA Development',
    status: 'pipeline',
    revenue: 7500,
    startDate: '2026-02-01',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Pending proposal'
  },
  {
    id: '5',
    name: 'Christou Homes',
    status: 'active',
    revenue: 7500,
    startDate: '2025-10-20',
    endDate: '2026-01-15',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Website build - near completion'
  },
  {
    id: '6',
    name: 'Sheridan Building',
    status: 'completed',
    revenue: 7500,
    startDate: '2025-08-01',
    endDate: '2025-11-30',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Completed'
  },
  {
    id: '7',
    name: 'AVK Homes',
    status: 'pipeline',
    revenue: 7500,
    startDate: '2026-02-15',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'In discussion'
  },
  {
    id: '8',
    name: 'PROCON',
    status: 'active',
    revenue: 2500,
    startDate: '2026-01-20',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Landing page build'
  },
  {
    id: '9',
    name: 'Hammond Homes',
    status: 'pipeline',
    revenue: 7500,
    startDate: '2026-03-01',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Q1 prospect'
  },
  {
    id: '10',
    name: 'Boutique Constructions',
    status: 'completed',
    revenue: 2500,
    startDate: '2025-09-15',
    endDate: '2025-10-30',
    projectType: 'landing-page',
    source: 'Direct',
    notes: 'Referral client'
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
  return clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.revenue, 0);
}

export function getPipelineRevenue(): number {
  return clients.filter(c => c.status === 'pipeline').reduce((sum, c) => sum + c.revenue, 0);
}

export function getMonthlyRevenue(): { month: string; revenue: number; cumulative: number }[] {
  const months: { [key: string]: number } = {};
  
  clients.forEach(client => {
    if (client.status === 'completed' || client.status === 'active') {
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
