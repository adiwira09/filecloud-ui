import React from 'react';
import { X } from 'lucide-react';

export default function NewFolderModal({
  isOpen,
  onClose,
  currentFolderName,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-lg w-full max-w-sm shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold mb-1">Buat Folder Baru</h3>
        <p className="text-xs text-gray-500 mb-4">Lokasi: {currentFolderName}</p>
        <form onSubmit={onCreateFolder}>
          <input
            type="text"
            placeholder="Nama folder..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="w-full border-2 border-black rounded p-2 text-sm mb-4 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-gray-400 rounded text-sm hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white rounded text-sm hover:bg-gray-800"
            >
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}