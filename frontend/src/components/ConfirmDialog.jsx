import React from 'react';
import Modal from './Modal';
import { Button } from './UI';
import { AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#232D42] pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
