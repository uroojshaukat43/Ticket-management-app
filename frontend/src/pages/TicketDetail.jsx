import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { adminAPI, ticketAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', status: 'Open' });
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTicket = async () => {
    try {
      const { data } = await ticketAPI.getOne(id);
      setTicket(data.ticket);
      setForm({
        title: data.ticket.title,
        description: data.ticket.description,
        priority: data.ticket.priority,
        status: data.ticket.status,
      });
      setAssignee(data.ticket.assignedTo?._id || '');
    } catch {
      setError('Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
    if (isAdmin) {
      adminAPI.getUsers().then(({ data }) => setUsers(data.users));
    }
  }, [id, isAdmin]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await ticketAPI.update(id, form);
      setTicket(data.ticket);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await ticketAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAssign = async () => {
    if (!assignee) return;
    setSaving(true);
    try {
      const { data } = await adminAPI.assignTicket(id, assignee);
      setTicket(data.ticket);
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status) => {
    setSaving(true);
    try {
      const { data } = await adminAPI.updateStatus(id, status);
      setTicket(data.ticket);
      setForm((prev) => ({ ...prev, status }));
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">{error || 'Ticket not found'}</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">
            ← Back to tickets
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="btn-secondary">
              Edit
            </button>
          )}
          <button type="button" onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {editing ? (
        <div className="card">
          <TicketForm
            form={form}
            onChange={handleChange}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            loading={saving}
            showStatus={isAdmin}
          />
          <button type="button" onClick={() => setEditing(false)} className="btn-secondary mt-3">
            Cancel
          </button>
        </div>
      ) : (
        <div className="card">
          <h2 className="mb-2 text-sm font-medium text-gray-500">Description</h2>
          <p className="whitespace-pre-wrap text-gray-800">{ticket.description}</p>
          <dl className="mt-6 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Created by</dt>
              <dd className="text-sm text-gray-800">{ticket.createdBy?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Assigned to</dt>
              <dd className="text-sm text-gray-800">{ticket.assignedTo?.name || 'Unassigned'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Created</dt>
              <dd className="text-sm text-gray-800">
                {new Date(ticket.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-gray-500">Last updated</dt>
              <dd className="text-sm text-gray-800">
                {new Date(ticket.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {isAdmin && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Admin Actions</h2>

          <div>
            <label htmlFor="assignee" className="mb-1 block text-sm font-medium text-gray-700">
              Assign ticket
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                id="assignee"
                className="input flex-1"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleAssign} disabled={saving} className="btn-primary">
                Assign
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Update status</p>
            <div className="flex flex-wrap gap-2">
              {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={saving || ticket.status === status}
                  onClick={() => handleStatusChange(status)}
                  className={`btn-secondary text-xs ${ticket.status === status ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
