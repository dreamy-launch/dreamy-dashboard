import SummaryCards from '@/components/SummaryCards';
import ClientTable from '@/components/ClientTable';
import RevenueChart from '@/components/RevenueChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProspectsPanel from '@/components/ProspectsPanel';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dreamy Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Client revenue & project tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-NZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards />
        </section>

        {/* Charts, Timeline, and Prospects Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5">
            <RevenueChart />
          </div>
          <div className="lg:col-span-4">
            <ProjectTimeline />
          </div>
          <div className="lg:col-span-3">
            <ProspectsPanel />
          </div>
        </section>

        {/* Client Table */}
        <section>
          <ClientTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Dreamy · Websites for Builders · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
