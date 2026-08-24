import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';

export default function FileGrid({
  files,
  selectedItemIds,
  handleSelectItem,
  handleOpenFolder,
  handleOpenPreview,
  handleDownload,
  handleDelete,
  renderFileIcon,
  renderGridThumbnail,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
      {files.map((file) => (
        <div
          key={file.id}
          className={`border border-black rounded-lg bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group relative ${
            selectedItemIds.includes(file.id) ? 'ring-2 ring-black bg-blue-50/20' : ''
          }`}
        >
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedItemIds.includes(file.id)}
              onChange={() => handleSelectItem(file.id)}
              className="w-4 h-4 accent-black cursor-pointer shadow"
            />
          </div>

          <div
            className="relative cursor-pointer select-none border-b border-gray-100 overflow-hidden"
            onClick={() => file.is_folder ? handleOpenFolder(file) : handleOpenPreview(file)}
          >
            {renderGridThumbnail(file)}

            {/* Floating Action Overlay Modern */}
            <div
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-md z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {!file.is_folder && (
                <>
                  <button
                    title="Preview"
                    onClick={() => handleOpenPreview(file)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Download"
                    onClick={() => handleDownload(file.id, file.name)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                title="Delete"
                onClick={() => handleDelete(file.id, file.name)}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-white flex flex-col justify-between flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              {renderFileIcon(file.type, "w-3.5 h-3.5 flex-shrink-0")}
              {file.is_folder ? (
                <button
                  onClick={() => handleOpenFolder(file)}
                  className="font-bold text-xs text-black hover:underline truncate text-left w-full"
                  title={file.name}
                >
                  {file.name}
                </button>
              ) : (
                <button
                  onClick={() => handleOpenPreview(file)}
                  className="font-bold text-xs text-gray-900 hover:text-blue-600 hover:underline truncate text-left w-full"
                  title={file.name}
                >
                  {file.name}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium pt-1 border-t border-gray-100 mt-1">
              <span className="truncate">{file.modified}</span>
              <span className="flex-shrink-0 ml-1">{file.size}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}