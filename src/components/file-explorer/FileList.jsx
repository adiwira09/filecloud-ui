import React from 'react';
import { Eye, Download, Trash2, MoreHorizontal, ArrowDown } from 'lucide-react';

export default function FileList({
  files,
  selectedItemIds,
  handleSelectAll,
  handleSelectItem,
  handleOpenFolder,
  handleOpenPreview,
  handleDownload,
  handleDelete,
  renderFileIcon,
}) {
  return (
    <div>
      {/* 1. TAMPILAN MOBILE (< md): CARD LIST BERTUMPUK */}
      <div className="md:hidden border border-black rounded-lg bg-white overflow-hidden divide-y divide-gray-200">
        {files.map((file) => (
          <div key={file.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {renderFileIcon(file.type, "w-6 h-6")}
              </div>
              <div className="min-w-0 flex-1">
                {file.is_folder ? (
                  <button
                    onClick={() => handleOpenFolder(file)}
                    className="font-semibold text-sm text-black hover:underline truncate block text-left w-full"
                  >
                    {file.name}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPreview(file)}
                    className="font-semibold text-sm text-gray-900 hover:text-blue-600 hover:underline truncate block text-left w-full"
                  >
                    {file.name}
                  </button>
                )}
                <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                  <span>{file.modified}</span>
                  {!file.is_folder && <span>• {file.size}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!file.is_folder && (
                <>
                  <button
                    title="Preview"
                    onClick={() => handleOpenPreview(file)}
                    className="p-1.5 text-gray-600 hover:text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Download"
                    onClick={() => handleDownload(file.id, file.name)}
                    className="p-1.5 text-gray-600 hover:text-black"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                title="Delete"
                onClick={() => handleDelete(file.id, file.name)}
                className="p-1.5 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. TAMPILAN DESKTOP (>= md): TABEL STANDAR */}
      <div className="hidden md:block border border-black rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-sm font-semibold">
              <th className="py-3 px-3 w-10 text-center border-r border-gray-300">
                <input
                  type="checkbox"
                  checked={files.length > 0 && selectedItemIds.length === files.length}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 border-r border-gray-300">Name</th>
              <th className="py-3 px-4 border-r border-gray-300 w-44">
                <div className="flex items-center gap-1">
                  <span>Modified</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-4 border-r border-gray-300 w-32">Size</th>
              <th className="py-3 px-4 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 text-sm">
            {files.map((file) => (
              <tr 
                key={file.id} 
                className={`hover:bg-gray-50/80 transition-colors ${
                  selectedItemIds.includes(file.id) ? 'bg-blue-50/60' : ''
                }`}
              >
                <td className="py-3 px-3 border-r border-gray-200 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(file.id)}
                    onChange={() => handleSelectItem(file.id)}
                    className="cursor-pointer"
                  />
                </td>

                <td className="py-3 px-4 border-r border-gray-200">
                  <div className="flex items-center gap-3">
                    {renderFileIcon(file.type)}
                    {file.is_folder ? (
                      <button
                        onClick={() => handleOpenFolder(file)}
                        className="font-medium text-black hover:underline text-left"
                      >
                        {file.name}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenPreview(file)}
                        className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left"
                      >
                        {file.name}
                      </button>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 border-r border-gray-200 text-gray-600">
                  {file.modified}
                </td>

                <td className="py-3 px-4 border-r border-gray-200 text-gray-600">
                  {file.size}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    {!file.is_folder && (
                      <>
                        <button
                          title="Preview"
                          onClick={() => handleOpenPreview(file)}
                          className="hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Download"
                          onClick={() => handleDownload(file.id, file.name)}
                          className="hover:text-black"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      title="Delete"
                      onClick={() => handleDelete(file.id, file.name)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button title="More Options" className="hover:text-black">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}