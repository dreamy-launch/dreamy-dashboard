'use client';

import { clients, Client, ProjectStatus, PaymentStatus } from '@/data/clients';
import { format } from 'date-fns';

const formatCurrency = (amount: number, currency: 'NZD' | 'AUD' = 'NZD') => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const projectStatusColors: Record<ProjectStatus, string> = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'waiting-on-client': 'bg-yellow-100 text-yellow-800',
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Done',
  'waiting-on-client': 'Waiting',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  'unpaid': 'bg-gray-100 text-gray-600',
  'deposit-pending': 'bg-purple-100 text-purple-800',
  'deposit-paid': 'bg-orange-100 text-orange-800',
  'paid-in-full': 'bg-green-100 text-green-800',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  'unpaid': 'Lead',
  'deposit-pending': 'Awaiting Dep',
  'deposit-paid': '50% Paid',
  'paid-in-full': 'Paid ✓',
};

const projectTypeLabels: Record<Client['projectType'], string> = {
  'landing-page': 'LP',
  'full-site': 'Full Site',
  'maintenance': 'Maint',
  'redesign': 'Redesign',
};

export default function ClientTable() {
  // Sort: waiting-on-client first (money to collect), then active, then completed
  const sortedClients = [...clients].sort((a, b) => {
    const statusOrder: Record<ProjectStatus, number> = { 'waiting-on-client': 0, active: 1, completed: 2 };
    if (statusOrder[a.projectStatus] !== statusOrder[b.projectStatus]) {
      return statusOrder[a.projectStatus] - statusOrder[b.projectStatus];
    }
    // Within same status, sort by balance due (highest first)
    return b.balanceDue - a.balanceDue;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">2026 Projects & Cashflow</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Collected
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Balance Due
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedClients.map((client) => (
              <tr key={client.id} className={`hover:bg-gray-50 transition-colors ${client.projectStatus === 'waiting-on-client' && client.balanceDue > 0 ? 'bg-yellow-50/50' : ''}`}>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    {client.blockedBy && (
                      <p className="text-xs text-amber-600 mt-0.5">⚠️ {client.blockedBy}</p>
                    )}
                    {!client.blockedBy && client.notes && (
                      <p className="text-xs text-gray-500 mt-0.5">{client.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${projectStatusColors[client.projectStatus]}`}>
                    {projectStatusLabels[client.projectStatus]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[client.paymentStatus]}`}>
                    {paymentStatusLabels[client.paymentStatus]}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-green-700">
                  {client.depositPaid > 0 ? formatCurrency(client.depositPaid, client.currency) : '—'}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium">
                  {client.balanceDue > 0 ? (
                    <span className="text-amber-600">{formatCurrency(client.balanceDue, client.currency)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {formatCurrency(client.totalRevenue, client.currency)}
                  {client.currency === 'AUD' && <span className="ml-1 text-xs text-gray-400">AUD</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700" colSpan={3}>Totals</td>
              <td className="px-4 py-3 text-right text-sm text-green-700">
                {formatCurrency(clients.reduce((s, c) => s + c.depositPaid, 0))}
              </td>
              <td className="px-4 py-3 text-right text-sm text-amber-600">
                {formatCurrency(clients.reduce((s, c) => s + c.balanceDue, 0))}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-700">
                {formatCurrency(clients.reduce((s, c) => s + c.totalRevenue, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
