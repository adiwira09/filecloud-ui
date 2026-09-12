import React, { useState, useEffect } from 'react';
import { Download, X, File, Music, Loader2 } from 'lucide-react';
import { API_BASE } from '../../utils/constants';

export default function FilePreviewModal({
  previewItem,
  onClose,
  authToken,
  isPreviewLoading,
  setIsPreviewLoading,
  previewError,
  setPreviewError,
  textContent,
  handleOpenPreview,
  handleDownload,
  renderFileIcon,
}) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!previewItem || previewItem.type === 'text') {
      setBlobUrl(null);
      return;
    }

    let isMounted = true;
    let currentObjectUrl = null;

    const loadMedia = async () => {
      setIsPreviewLoading(true);
      setPreviewError(false);

      try {
        const res = await fetch(
          `${API_BASE}/api/preview/${previewItem.id}`,
          {
            headers: {
              'X-API-Key': authToken,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Gagal memuat preview');
        }

        const blob = await res.blob();
        currentObjectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setBlobUrl(currentObjectUrl);
          setIsPreviewLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setPreviewError(true);
          setIsPreviewLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [
    previewItem?.id,
    previewItem?.type,
    authToken,
    setIsPreviewLoading,
    setPreviewError,
  ]);

  if (!previewItem) {
    return null;
  }

  const renderPreviewBody = () => {
    if (previewError) {
      return (
        <div className="text-center py-12 px-4 bg-red-50 rounded border border-red-200">
          <File className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h4 className="font-bold text-red-700 mb-1">Gagal Memuat Preview</h4>
          <p className="text-sm text-red-600 mb-4">Koneksi terputus atau server lambat.</p>
          <div className="flex justify-center gap-2">
            <button onClick={() => handleOpenPreview(previewItem)} className="px-4 py-1.5 bg-black text-white rounded text-sm hover:bg-gray-800">Coba Lagi</button>
            <button onClick={() => handleDownload(previewItem.id, previewItem.name)} className="px-4 py-1.5 border border-gray-400 rounded text-sm hover:bg-gray-100">Download File</button>
          </div>
        </div>
      );
    }

    switch (previewItem.type) {
      case 'image':
        return (
          <div className="flex justify-center items-center bg-gray-900/5 rounded p-4 min-h-[300px] max-h-[70vh] overflow-auto">
            {blobUrl && <img src={blobUrl} alt={previewItem.name} className="max-h-[65vh] object-contain rounded shadow" />}
          </div>
        );
      case 'pdf':
        return blobUrl ? (
          <div className="w-full h-[65vh] sm:h-[70vh] overflow-y-auto rounded border border-gray-300 -webkit-overflow-scrolling-touch">
            <iframe src={blobUrl} title={previewItem.name} className="w-full h-full min-h-[400px]" />
          </div>
        ) : null;
      case 'text':
        return <pre className="p-4 bg-gray-900 text-green-400 font-mono text-xs rounded max-h-[70vh] overflow-auto whitespace-pre-wrap">{textContent}</pre>;
      case 'video':
        return blobUrl ? <div className="flex justify-center bg-black rounded p-2 min-h-[250px] items-center"><video controls src={blobUrl} className="max-h-[70vh] w-full rounded" /></div> : null;
      case 'audio':
        return blobUrl ? (
          <div className="p-8 flex flex-col items-center justify-center bg-gray-50 rounded border border-gray-200">
            <Music className="w-16 h-16 text-pink-500 mb-4 animate-bounce" />
            <p className="font-semibold text-gray-700 mb-4">{previewItem.name}</p>
            <audio controls src={blobUrl} className="w-full max-w-md" />
          </div>
        ) : null;
      default:
        return (
          <div className="text-center py-12 px-4 bg-gray-50 rounded border border-gray-200">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-1">Preview Tidak Tersedia</h4>
            <button onClick={() => handleDownload(previewItem.id, previewItem.name)} className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800">
              <Download className="w-4 h-4" /> Download File
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white border-2 border-black p-3.5 sm:p-6 rounded-lg w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {renderFileIcon(previewItem.type)}
            <h3 className="text-sm sm:text-lg font-bold truncate min-w-0" title={previewItem.name}>{previewItem.name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => handleDownload(previewItem.id, previewItem.name)} className="p-1.5 text-gray-600 hover:text-black"><Download className="w-5 h-5" /></button>
            <button onClick={onClose} className="p-1.5 text-gray-600 hover:text-black"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto relative min-h-[250px]">
          {isPreviewLoading && !previewError && (
            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
              <span className="text-xs font-semibold text-gray-600">Memuat file, harap tunggu...</span>
            </div>
          )}
          {renderPreviewBody()}
        </div>
      </div>
    </div>
  );
}