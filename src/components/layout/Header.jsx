import React from 'react';
import { Cloud, Upload, FolderPlus, User, Menu } from 'lucide-react';

export default function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenUploadModal,
  onOpenNewFolderModal,
}) {
  return (
    <header className="h-16 border-b border-gray-300 px-4 sm:px-6 flex items-center justify-between bg-white select-none z-30 relative">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 md:hidden border border-gray-400 rounded hover:bg-gray-100 flex-shrink-0"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-gray-800" />
        </button>

        <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold flex-shrink-0">
          <Cloud className="w-5 h-5 text-gray-800" />
        </div>
        
        <span className="font-bold text-sm sm:text-xl tracking-wider truncate min-w-0">
          BILIK UNUYADI
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 sm:gap-2 border-2 border-black px-2.5 sm:px-4 py-1.5 rounded font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">UPLOAD FILES</span>
        </button>

        <button
          onClick={onOpenNewFolderModal}
          className="flex items-center gap-1.5 sm:gap-2 border-2 border-black px-2.5 sm:px-4 py-1.5 rounded font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span className="hidden sm:inline">NEW FOLDER</span>
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-2 sm:pl-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-700" />
          </div>
          <span className="font-semibold text-sm hidden lg:inline">User Name</span>
        </div>
      </div>
    </header>
  );
}