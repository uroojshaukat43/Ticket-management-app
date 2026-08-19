import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

const STATUS_COLORS = {
  Open: 'bg-blue-500',
  'In Progress': 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Closed: 'bg-gray-500',
};

export default function AdminDashboard() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI
      .getReports()
      .then(({ data }) => setReports(data.reports))
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>;
  }

  const maxStatus = Math.max(...(reports.byStatus.map((s) => s.count) || [1]), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of tickets and system activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Tickets</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{reports.totalTickets}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Registered Users</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{reports.totalUsers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Open Tickets</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {reports.byStatus.find((s) => s._id === 'Open')?.count || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="mt-1 text-3xl font-bold text-yellow-600">
            {reports.byStatus.find((s) => s._id === 'In Progress')?.count || 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tickets by Status</h2>
          <div className="space-y-3">
            {reports.byStatus.map((item) => (
              <div key={item._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${STATUS_COLORS[item._id] || 'bg-indigo-500'}`}
                    style={{ width: `${(item.count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tickets by Priority</h2>
          <div className="space-y-2">
            {reports.byPriority.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <PriorityBadge priority={item._id} />
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {reports.recentTickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="flex flex-col gap-2 py-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{ticket.title}</p>
                <p className="text-sm text-gray-500">by {ticket.createdBy?.name}</p>
              </div>
              <StatusBadge status={ticket.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
