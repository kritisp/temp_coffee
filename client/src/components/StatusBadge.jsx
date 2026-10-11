// Coloured label for an order status. Prop: status (a string).
const COLORS = {
  'Received': '#d97706',
  'Being Prepared': '#2563eb',
  'Delivered': '#16a34a',
};

export default function StatusBadge({ status }) {
  return (
    <span className="badge" style={{ background: COLORS[status] || '#797167' }}>
      {status}
    </span>
  );
}
