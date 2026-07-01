'use client';

import { useState, useRef, useEffect } from 'react';
import './AdminLayout.css';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Action {
  key?: string;
  label: string | ((row: any) => string);
  onClick: (row: any) => void;
  variant?: 'default' | 'danger';
  show?: (row: any) => boolean;
  loading?: (row: any) => boolean;
  dropdown?: boolean; // if true, tucked into the "⋯" secondary menu
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
}

function ActionsCell({ row, actions }: { row: any; actions: Action[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleActions = actions.filter((a) => !a.show || a.show(row));
  const primaryActions = visibleActions.filter((a) => !a.dropdown);
  const secondaryActions = visibleActions.filter((a) => a.dropdown);

  const getLabel = (action: Action) =>
    typeof action.label === 'function' ? action.label(row) : action.label;

  return (
    <div className="admin-table__actions">
      {primaryActions.map((action, idx) => {
        const isLoading = action.loading ? action.loading(row) : false;
        return (
          <button
            key={action.key || idx}
            onClick={() => action.onClick(row)}
            disabled={isLoading}
            className={`admin-table__btn ${action.variant === 'danger' ? 'admin-table__btn--danger' : ''}`}
          >
            {isLoading ? <span className="admin-table__spinner" /> : getLabel(action)}
          </button>
        );
      })}

      {secondaryActions.length > 0 && (
        <div className="admin-table__dropdown" ref={ref}>
          <button
            type="button"
            className="admin-table__btn admin-table__dropdown-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="More actions"
          >
            ⋯
          </button>
          {open && (
            <div className="admin-table__dropdown-menu">
              {secondaryActions.map((action, idx) => {
                const isLoading = action.loading ? action.loading(row) : false;
                return (
                  <button
                    key={action.key || idx}
                    type="button"
                    disabled={isLoading}
                    className={`admin-table__dropdown-item ${action.variant === 'danger' ? 'admin-table__dropdown-item--danger' : ''}`}
                    onClick={() => {
                      setOpen(false);
                      action.onClick(row);
                    }}
                  >
                    {isLoading ? <span className="admin-table__spinner" /> : getLabel(action)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DataTable({ columns, data, actions }: DataTableProps) {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <ActionsCell row={row} actions={actions} />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
