import React from 'react';
import { X, Trash2, Clock, ArrowRight, HardDrive } from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface LocalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
}

export const LocalHistoryModal: React.FC<LocalHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onDeleteScan,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to delete all saved scan history from this device? This action cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-navy-950 border-l border-navy-800 shadow-2xl flex flex-col p-6 animate-slide-left">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">Local Scan History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
            aria-label="Close History"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800 text-xs text-slate-400 leading-relaxed">
          🔒 History is stored strictly in your browser’s <code className="text-teal-300 font-mono">localStorage</code>. Zero scans are stored on our servers.
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
              <Clock className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium">No saved scans yet</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                When you run a scan, click "Save to Device" to bookmark results locally.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-navy-900/70 border border-navy-800/80 hover:border-teal-500/30 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-navy-950 text-slate-400 border border-navy-800 font-bold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{dateStr}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {item.summarySnippet}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-navy-800/60">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.riskLevel === 'high_risk'
                          ? 'bg-red-950 text-red-300'
                          : item.riskLevel === 'suspicious'
                          ? 'bg-amber-950 text-amber-300'
                          : item.riskLevel === 'trustworthy'
                          ? 'bg-teal-950 text-teal-300'
                          : 'bg-navy-950 text-slate-400'
                      }`}
                    >
                      {item.riskLevel.replace('_', ' ')}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteScan(item.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectScan(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-teal-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-navy-800 mt-2">
            <button
              onClick={handleClearWithConfirm}
              className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Local History ({history.length})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
