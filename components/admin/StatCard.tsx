import './AdminLayout.css';

interface StatCardProps {
  value: string | number;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__value">{value}</div>
      <div className="admin-stat-card__label">{label}</div>
    </div>
  );
}