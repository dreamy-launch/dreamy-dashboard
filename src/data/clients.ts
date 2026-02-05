export type ProjectStatus = 'active' | 'waiting-on-client' | 'completed';
export type PaymentStatus = 'unpaid' | 'deposit-pending' | 'deposit-paid' | 'paid-in-full';

export interface Client {
  id: string;
  name: string;
  projectStatus: ProjectStatus;
  paymentStatus: PaymentStatus;
  totalRevenue: number;
  depositPaid: number;
  balanceDue: number;
  currency: 'NZD' | 'AUD';
  startDate: string;
  completedDate?: string;
  projectType: 'landing-page' | 'full-site' | 'maintenance' | 'redesign';
  source: string;
  notes?: string;
  blockedBy?: string; // What we're waiting on
}

// 2026 Client Data
export const clients: Client[] = [
  // Completed & Paid
  {
    id: '1',
    name: 'Ascension RCA',
    projectStatus: 'completed',
    paymentStatus: 'paid-in-full',
    totalRevenue: 7500,
    depositPaid: 3750,
    balanceDue: 0,
    currency: 'NZD',
    startDate: '2026-01-01',
    completedDate: '2026-01-31',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Finished & paid'
  },
  // Waiting on Client - Deposit Paid
  {
    id: '2',
    name: 'Jimmy Bull Construction',
    projectStatus: 'waiting-on-client',
    paymentStatus: 'deposit-paid',
    totalRevenue: 8175,
    depositPaid: 4088,
    balanceDue: 4087,
    currency: 'NZD',
    startDate: '2026-01-10',
    projectType: 'full-site',
    source: 'Sea Salt',
    notes: 'Originally $7,500 AUD. Pending final 50%',
    blockedBy: 'Client logins, domain access, final assets'
  },
  {
    id: '3',
    name: 'Procon',
    projectStatus: 'waiting-on-client',
    paymentStatus: 'deposit-paid',
    totalRevenue: 2725,
    depositPaid: 1363,
    balanceDue: 1362,
    currency: 'NZD',
    startDate: '2026-01-15',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Originally $2,500 AUD. Pending final 50%',
    blockedBy: 'Client logins, domain access, final assets'
  },
  // Paid in Full - Waiting on Content
  {
    id: '4',
    name: 'Jay Lash',
    projectStatus: 'waiting-on-client',
    paymentStatus: 'paid-in-full',
    totalRevenue: 2500,
    depositPaid: 2500,
    balanceDue: 0,
    currency: 'NZD',
    startDate: '2026-01-20',
    projectType: 'landing-page',
    source: 'Sea Salt',
    notes: 'Paid in full',
    blockedBy: 'Waiting on content from client'
  },
  // Active
  {
    id: '5',
    name: "Let's Go Website",
    projectStatus: 'active',
    paymentStatus: 'deposit-pending',
    totalRevenue: 9538,
    depositPaid: 0,
    balanceDue: 9538,
    currency: 'NZD',
    startDate: '2026-02-01',
    projectType: 'full-site',
    source: 'House of Mood',
    notes: 'Originally $8,750 AUD. Awaiting deposit.'
  },
  // Leads / Pipeline (no payment yet)
  {
    id: '6',
    name: 'Ben Roofing',
    projectStatus: 'active',
    paymentStatus: 'unpaid',
    totalRevenue: 750,
    depositPaid: 0,
    balanceDue: 750,
    currency: 'NZD',
    startDate: '2026-02-15',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Prospect'
  },
  {
    id: '7',
    name: 'Ben Cladding',
    projectStatus: 'active',
    paymentStatus: 'unpaid',
    totalRevenue: 750,
    depositPaid: 0,
    balanceDue: 750,
    currency: 'NZD',
    startDate: '2026-02-15',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Prospect'
  },
  {
    id: '8',
    name: 'Sam - Pacman Trees',
    projectStatus: 'active',
    paymentStatus: 'unpaid',
    totalRevenue: 1500,
    depositPaid: 0,
    balanceDue: 1500,
    currency: 'NZD',
    startDate: '2026-02-20',
    projectType: 'landing-page',
    source: 'Lead',
    notes: 'Prospect'
  }
];

// Revenue calculations
export function getCashCollected(): number {
  return clients.reduce((sum, c) => sum + c.depositPaid, 0);
}

export function getBalanceDue(): number {
  return clients.reduce((sum, c) => sum + c.balanceDue, 0);
}

export function getTotalContractValue(): number {
  return clients.reduce((sum, c) => sum + c.totalRevenue, 0);
}

export function getPipelineValue(): number {
  return clients.filter(c => c.paymentStatus === 'unpaid').reduce((sum, c) => sum + c.totalRevenue, 0);
}

export function getConfirmedPendingDeposit(): number {
  return clients.filter(c => c.paymentStatus === 'deposit-pending').reduce((sum, c) => sum + c.totalRevenue, 0);
}

export function getWaitingOnClientRevenue(): number {
  return clients.filter(c => c.projectStatus === 'waiting-on-client' && c.balanceDue > 0).reduce((sum, c) => sum + c.balanceDue, 0);
}

export function getClientsByStatus(status: ProjectStatus): Client[] {
  return clients.filter(c => c.projectStatus === status);
}

export function getMonthlyRevenue(): { month: string; collected: number; pending: number }[] {
  const months: { [key: string]: { collected: number; pending: number } } = {};
  
  clients.forEach(client => {
    const date = new Date(client.startDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!months[monthKey]) {
      months[monthKey] = { collected: 0, pending: 0 };
    }
    months[monthKey].collected += client.depositPaid;
    months[monthKey].pending += client.balanceDue;
  });

  const sortedMonths = Object.keys(months).sort();
  
  return sortedMonths.map(month => {
    const [year, m] = month.split('-');
    const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-NZ', { month: 'short', year: '2-digit' });
    return {
      month: monthName,
      collected: months[month].collected,
      pending: months[month].pending
    };
  });
}
