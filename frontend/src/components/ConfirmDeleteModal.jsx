import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this record',
  itemType = 'item',
  isDeleting = false,
  error = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-[#161626] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg capitalize">Delete {itemType}</h3>
              <p className="text-xs text-gym-muted">Confirm permanent deletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gym-muted hover:text-white p-1 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-300 leading-relaxed">
          Are you sure you want to delete <strong className="text-white font-semibold">{itemName}</strong>? This action cannot be undone and all associated records will be permanently removed.
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-gym-card hover:bg-gym-dark text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-gym-border transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete {itemType}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
