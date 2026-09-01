import React from 'react';
import { Folder } from 'lucide-react';

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
  setBreadcrumbs,
  storage,
}) {
  return (
    <>
      {/* OVERLAY DI HP SAAT SIDEBAR TERBUKA */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-gray-50 border-r border-gray-300 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1">
          <button
            onClick={() => {
              setActiveTab('my-files');
              setBreadcrumbs([{ id: null, name: 'My Files' }]);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'my-files'
                ? 'bg-gray-200 text-black border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>My Files</span>
          </button>
        </nav>

        <div className="border-t border-gray-300 pt-4">
          <div className="text-xs font-semibold text-gray-700 mb-1.5">
            Storage: {storage.percentage}% | {storage.used_formatted} / {storage.total_formatted}
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full border border-gray-400 overflow-hidden">
            <div
              className="bg-gray-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(storage.percentage, 100)}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}