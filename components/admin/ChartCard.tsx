import './AdminLayout.css';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-card__title">{title}</h3>
      {children}
    </div>
  );
}