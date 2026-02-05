'use client';

import { clients, ProjectStatus, PaymentStatus } from '@/data/clients';
import { format, parseISO } from 'date-fns';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProjectTimeline() {
  // Group by status
  const waitingOnClient = clients.filter(c => c.projectStatus === 'waiting-on-client');
  const active = clients.filter(c => c.projectStatus === 'active' && c.paymentStatus !== 'unpaid');
  const leads = clients.filter(c => c.paymentStatus === 'unpaid');
  const completed = clients.filter(c => c.projectStatus === 'completed');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h2>
      
      {/* Waiting on Client - Priority */}
      {waitingOnClient.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
            ⚠️ Waiting on Client
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {formatCurrency(waitingOnClient.reduce((s,c) => s + c.balanceDue, 0))} due
            </span>
          </h3>
          <div className="space-y-2">
            {waitingOnClient.map((client) => (
              <div key={client.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                    <p className="text-xs text-amber-600 mt-0.5">{client.blockedBy}</p>
                  </div>
                  <div className="text-right">
                    {client.balanceDue > 0 && (
                      <p className="text-sm font-semibold text-amber-700">{formatCurrency(client.balanceDue)}</p>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded ${client.paymentStatus === 'paid-in-full' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {client.paymentStatus === 'paid-in-full' ? 'Paid ✓' : '50% paid'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active */}
      {active.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-blue-600 mb-2">🔵 In Progress</h3>
          <div className="space-y-2">
            {active.map((client) => (
              <div key={client.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                  <p className="text-sm font-semibold text-blue-700">{formatCurrency(client.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leads */}
      {leads.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-medium text-purple-600 mb-2">🟣 Leads</h3>
          <div className="space-y-2">
            {leads.map((client) => (
              <div key={client.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                  <p className="text-sm font-semibold text-purple-700">{formatCurrency(client.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-green-600 mb-2">✅ Completed</h3>
          <div className="space-y-2">
            {completed.map((client) => (
              <div key={client.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                  <p className="text-sm font-semibold text-green-700">{formatCurrency(client.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
