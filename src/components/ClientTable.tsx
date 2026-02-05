'use client';

import { clients, Client, ClientStatus } from '@/data/clients';
import { format } from 'date-fns';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusColors: Record<ClientStatus, string> = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  pipeline: 'bg-purple-100 text-purple-800',
};

const projectTypeLabels: Record<Client['projectType'], string> = {
  'landing-page': 'Landing Page',
  'full-site': 'Full Site',
  'maintenance': 'Maintenance',
  'redesign': 'Redesign',
};

export default function ClientTable() {
  const sortedClients = [...clients].sort((a, b) => {
    const statusOrder: Record<ClientStatus, number> = { active: 0, pipeline: 1, 'on-hold': 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Client Projects</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    {client.notes && (
                      <p className="text-sm text-gray-500">{client.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[client.status]}`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {projectTypeLabels[client.projectType]}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(client.revenue)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {format(new Date(client.startDate), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
