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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-[#161626] border border-red-500/30 rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg capitalize">Delete {itemType}</h3>
              <p className="text-xs text-gym-muted">Confirm permanent deletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gym-muted hover:text-white p-2 rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Are you sure you want to delete <strong className="text-white font-semibold">{itemName}</strong>? This action cannot be undone and all associated records will be permanently removed.
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2.5 sm:space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-3 bg-gym-card hover:bg-gym-dark text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-gym-border transition-all disabled:opacity-50 min-h-[44px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
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
