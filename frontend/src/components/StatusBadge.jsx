const styles = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
};

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-orange-100 text-orange-800',
  High: 'bg-red-100 text-red-800',
  Critical: 'bg-purple-100 text-purple-800',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.Open}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[priority] || priorityStyles.Medium}`}>
      {priority}
    </span>
  );
}
