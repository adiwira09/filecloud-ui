import React from 'react';
import { Cloud, Upload, FolderPlus, LogOut, Menu } from 'lucide-react';

export default function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenUploadModal,
  onOpenNewFolderModal,
  onLogout,
}) {
  return (
    <header className="h-16 border-b border-gray-300 px-4 sm:px-6 flex items-center justify-between bg-white select-none z-30 relative">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 md:hidden border border-gray-300 bg-gray-50 rounded-md hover:bg-gray-100 flex-shrink-0 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-gray-800" />
        </button>

        <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold flex-shrink-0 rounded">
          <Cloud className="w-5 h-5 text-gray-800" />
        </div>
        
        <span className="font-bold text-sm sm:text-xl tracking-wider truncate min-w-0 text-black">
          BILIK UNUYADI
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-black text-white border border-black rounded-md font-semibold text-xs sm:text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
          title="Upload File"
        >
          <Upload className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden sm:inline">Upload File</span>
        </button>

        <button
          onClick={onOpenNewFolderModal}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-semibold text-xs sm:text-sm hover:bg-gray-100 hover:border-gray-400 hover:text-black active:scale-[0.98] transition-all"
          title="Buat Folder Baru"
        >
          <FolderPlus className="w-4 h-4 stroke-[2]" />
          <span className="hidden sm:inline">Folder Baru</span>
        </button>

        <div className="border-l border-gray-200 pl-2 sm:pl-3 ml-1">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-red-50 hover:border-red-400 hover:text-red-600 active:scale-[0.98] transition-colors text-xs sm:text-sm font-semibold text-gray-700"
            title="Kunci Sesi / Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}