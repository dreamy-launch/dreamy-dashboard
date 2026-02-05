'use client';

import { getMonthlyRevenue, getCashCollected, getBalanceDue } from '@/data/clients';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6'];

export default function RevenueChart() {
  const data = getMonthlyRevenue();
  const cashCollected = getCashCollected();
  const balanceDue = getBalanceDue();
  
  const pieData = [
    { name: 'Collected', value: cashCollected },
    { name: 'Due', value: balanceDue },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cashflow Overview</h2>
      
      {/* Pie Chart - Cash Position */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-600">Collected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-gray-600">Balance Due</span>
        </div>
      </div>
      
      {/* Monthly Breakdown */}
      <h3 className="text-sm font-medium text-gray-600 mb-3">Monthly Breakdown</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
