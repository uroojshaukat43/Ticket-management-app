const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export default function TicketForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  loading,
  showStatus = false,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="input"
          value={form.title}
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="input"
          value={form.description}
          onChange={onChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="mb-1 block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select id="priority" name="priority" className="input" value={form.priority} onChange={onChange}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {showStatus && (
          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select id="status" name="status" className="input" value={form.status} onChange={onChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
