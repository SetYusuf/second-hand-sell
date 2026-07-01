import { useState } from 'react';
import './AdminLayout.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
  // Optional reason textarea (used for Reject action)
  showReasonInput?: boolean;
  reasonValue?: string;
  onReasonChange?: (value: string) => void;
  reasonPlaceholder?: string;
  confirmDisabled?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  showReasonInput = false,
  reasonValue = '',
  onReasonChange,
  reasonPlaceholder = 'Optional reason...',
  confirmDisabled = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal__title">{title}</h2>
        <p className="admin-modal__message">{message}</p>
        {showReasonInput && (
          <div className="admin-form-group">
            <label className="admin-form-label">Reason (optional)</label>
            <textarea
              className="admin-textarea"
              value={reasonValue}
              placeholder={reasonPlaceholder}
              onChange={(e) => onReasonChange?.(e.target.value)}
            />
          </div>
        )}
        <div className="admin-modal__actions">

          <button onClick={onCancel} className="admin-modal__btn">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`admin-modal__btn ${variant === 'danger' ? 'admin-modal__btn--primary' : ''}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}