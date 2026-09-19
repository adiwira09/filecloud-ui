import React from 'react';
import { Upload, X } from 'lucide-react';

export default function UploadModal({
  isOpen,
  onClose,
  currentFolderName,
  isUploading,
  fileInputRef,
  handleFileSelect,
  selectedFiles,
  setSelectedFiles,
  skippedFiles,
  setSkippedFiles,
  currentFileIndex,
  uploadProgress,
  uploadStatus,
  handleUploadSubmit,
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSelectedFiles([]);
    setSkippedFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <button
          disabled={isUploading}
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold mb-1">Upload Multiple Files</h3>
        <p className="text-xs text-gray-500 mb-4"></p>

        <form onSubmit={handleUploadSubmit}>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {/* Area Klik Pilih File */}
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-gray-400 p-5 text-center rounded bg-gray-50 transition-colors mb-3 ${
              isUploading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <Upload className="w-7 h-7 mx-auto text-gray-500 mb-1" />
            <p className="text-xs font-semibold text-gray-700">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file terpilih`
                : "Klik untuk memilih satu atau beberapa file"}
            </p>
          </div>

          {/* Peringatan Jika Ada File Dilarang yang Di-skip */}
          {skippedFiles.length > 0 && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-300 rounded text-xs text-red-700">
              <span className="font-bold block mb-1">
                {skippedFiles.length} file diabaikan (format tidak diperbolehkan):
              </span>
              <ul className="list-disc list-inside max-h-20 overflow-y-auto font-mono text-[11px]">
                {skippedFiles.map((name, idx) => (
                  <li key={idx} className="truncate">{name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Daftar File Valid */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="mb-4 max-h-28 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
              <span className="text-[11px] font-bold text-gray-500 block mb-1">File siap diunggah:</span>
              {selectedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-700 truncate py-0.5 border-b last:border-0 border-gray-200"
                >
                  • {f.name}{' '}
                  <span className="text-gray-400">
                    ({(f.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Indikator Progress Upload */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                <span>
                  {uploadStatus === 'finalizing'
                    ? 'Finalizing...'
                    : `Mengunggah File ${currentFileIndex} dari ${selectedFiles.length}`}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden border border-black">
                <div
                  className="bg-black h-full transition-all duration-200 ease-out"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1 truncate">
                {uploadStatus === 'finalizing'
                  ? `Menyimpan metadata: ${selectedFiles[currentFileIndex - 1]?.name}`
                  : `Uploading: ${selectedFiles[currentFileIndex - 1]?.name}`}
              </p>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleClose}
              className="px-4 py-1.5 border border-gray-400 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={selectedFiles.length === 0 || isUploading}
              className="px-4 py-1.5 bg-black text-white rounded text-sm hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isUploading ? uploadStatus === 'finalizing' ? 'Finalizing...' : `Mengunggah (${currentFileIndex}/${selectedFiles.length})...` : "Upload Semua"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}