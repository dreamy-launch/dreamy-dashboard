'use client';

import { clients, ClientStatus } from '@/data/clients';
import { format, differenceInDays, parseISO } from 'date-fns';

const statusColors: Record<ClientStatus, string> = {
  active: 'bg-blue-500',
  completed: 'bg-green-500',
  'on-hold': 'bg-yellow-500',
  pipeline: 'bg-purple-500',
};

const statusBgColors: Record<ClientStatus, string> = {
  active: 'bg-blue-50 border-blue-200',
  completed: 'bg-green-50 border-green-200',
  'on-hold': 'bg-yellow-50 border-yellow-200',
  pipeline: 'bg-purple-50 border-purple-200',
};

export default function ProjectTimeline() {
  const today = new Date();
  
  // Sort by start date, most recent first
  const sortedClients = [...clients]
    .filter(c => c.status !== 'completed')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const completedClients = clients.filter(c => c.status === 'completed');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h2>
      
      {/* Active & Pipeline */}
      <div className="space-y-3">
        {sortedClients.map((client) => {
          const startDate = parseISO(client.startDate);
          const daysElapsed = differenceInDays(today, startDate);
          const isUpcoming = daysElapsed < 0;
          
          return (
            <div
              key={client.id}
              className={`flex items-center p-4 rounded-xl border ${statusBgColors[client.status]} transition-all hover:shadow-md`}
            >
              <div className={`w-3 h-3 rounded-full ${statusColors[client.status]} mr-4`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{client.name}</p>
                <p className="text-sm text-gray-600">
                  {isUpcoming
                    ? `Starts ${format(startDate, 'MMM d, yyyy')}`
                    : `Started ${format(startDate, 'MMM d, yyyy')} · ${daysElapsed} days ago`}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    client.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : client.status === 'pipeline'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {client.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Section */}
      {completedClients.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 mt-6 mb-3">Completed</h3>
          <div className="space-y-2">
            {completedClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{client.name}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {client.endDate && format(parseISO(client.endDate), 'MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
