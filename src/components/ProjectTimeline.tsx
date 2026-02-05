'use client';

import { clients, ClientStatus } from '@/data/clients';
import { format, differenceInDays, parseISO } from 'date-fns';

const statusColors: Record<ClientStatus, string> = {
  active: 'bg-blue-500',
  completed: 'bg-green-500',
  'almost-complete': 'bg-yellow-500',
  pipeline: 'bg-purple-500',
};

const statusBgColors: Record<ClientStatus, string> = {
  active: 'bg-blue-50 border-blue-200',
  completed: 'bg-green-50 border-green-200',
  'almost-complete': 'bg-yellow-50 border-yellow-200',
  pipeline: 'bg-purple-50 border-purple-200',
};

const statusLabels: Record<ClientStatus, string> = {
  active: 'Active',
  completed: 'Done',
  'almost-complete': 'Almost Done',
  pipeline: 'Lead',
};

export default function ProjectTimeline() {
  const today = new Date();
  
  // Sort by status priority, then by start date
  const sortedClients = [...clients]
    .filter(c => c.status !== 'completed')
    .sort((a, b) => {
      const statusOrder: Record<ClientStatus, number> = { 'almost-complete': 0, active: 1, pipeline: 2, completed: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

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
                    ? `Starts ${format(startDate, 'MMM d')}`
                    : `Started ${format(startDate, 'MMM d')} · ${daysElapsed}d ago`}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : client.status === 'almost-complete'
                      ? 'bg-yellow-100 text-yellow-800'
                      : client.status === 'pipeline'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[client.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Section */}
      {completedClients.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 mt-6 mb-3">✅ Completed</h3>
          <div className="space-y-2">
            {completedClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{client.name}</p>
                </div>
                <p className="text-xs text-green-600 font-medium">
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
