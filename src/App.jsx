import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  Trash2,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  File,
  Loader2,
  ChevronRight,
  Video,
  Music,
  Code,
  List,
  LayoutGrid,
} from 'lucide-react';

// Utils
import { API_BASE, DISALLOWED_EXTENSIONS } from './utils/constants';

// UI Components
import GridImageThumbnail from './components/GridImageThumbnail';
import AuthScreen from './components/AuthScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import FileList from './components/file-explorer/FileList';
import FileGrid from './components/file-explorer/FileGrid';

// Modals
import NewFolderModal from './components/modals/NewFolderModal';
import UploadModal from './components/modals/UploadModal';
import FilePreviewModal from './components/modals/FilePreviewModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('my-files');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [files, setFiles] = useState([]);

  // State untuk Mobile Menu (Hamburger Menu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fitur Tampilan Layout (Grid / List)
  const [viewMode, setViewMode] = useState('list');
  
  const [storage, setStorage] = useState({
    used_formatted: '0 B',
    total_formatted: '10 GB',
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // State Navigasi Folder (Breadcrumb Stack)
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Files' }]);
  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [skippedFiles, setSkippedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Upload Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  // State untuk menyimpan ID item yang dipilih (fitur multi-select)
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // State untuk menyimpan token autentikasi dari localStorage
  const getStoredAttempts = () => parseInt(localStorage.getItem('auth_failed_attempts') || '0', 10);
  const getStoredCooldown = () => {
    const until = parseInt(localStorage.getItem('auth_cooldown_until') || '0', 10);
    const remaining = Math.ceil((until - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [inputToken, setInputToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(getStoredAttempts);
  const [cooldown, setCooldown] = useState(getStoredCooldown);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  
  // Timer Countdown 60 Detik saat terkena Cooldown
  useEffect(() => {
    if (cooldown <= 0) {
      localStorage.removeItem('auth_cooldown_until');
      setAuthError('');
      return;
    }

    // Jika cooldown aktif saat refresh, pastikan pesan error langsung tampil
    if (!authError) {
      setAuthError(`Terlalu banyak percobaan! Silakan tunggu ${cooldown} detik.`);
    }

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('auth_cooldown_until');
          setAuthError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-Check Status IP ke Backend saat Form Login Dimuat
  useEffect(() => {
    if (authToken) return;

    const checkIpStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/storage`, {
          headers: { 
            'X-API-Key': 'status_check',
            'X-Check-Only': 'true' 
          },
        });

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          const retryAfter = data.retry_after || 60;
          const cooldownUntil = Date.now() + (retryAfter * 1000);

          localStorage.setItem('auth_cooldown_until', cooldownUntil.toString());
          setCooldown(retryAfter);
          setAuthError(`IP Anda sedang diblokir server! Silakan tunggu ${retryAfter} detik.`);
        }
      } catch (err) {
        console.error("Gagal mengecek status IP:", err);
      }
    };

    checkIpStatus();
  }, [authToken]);

  // fetch otomatis menyisipkan token autentikasi di Header
  const handleSaveToken = async (e) => {
    e.preventDefault();
    if (cooldown > 0 || isVerifyingToken || !inputToken.trim()) return;

    setIsVerifyingToken(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/api/storage`, {
        headers: { 'X-API-Key': inputToken },
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const retryAfter = data.retry_after || 60;
        const cooldownUntil = Date.now() + (retryAfter * 1000);
        
        localStorage.setItem('auth_cooldown_until', cooldownUntil.toString());
        setCooldown(retryAfter);
        setAuthError(`Terlalu banyak percobaan! Diblokir server selama ${retryAfter} detik.`);
        return;
      }

      if (res.ok) {
        localStorage.setItem('auth_token', inputToken);
        localStorage.removeItem('auth_failed_attempts');
        localStorage.removeItem('auth_cooldown_until');
        setAuthToken(inputToken);
        setFailedAttempts(0);
        setAuthError('');
      } else {
        const newAttempts = failedAttempts + 1;
        if (newAttempts >= 5) {
          const cooldownUntil = Date.now() + 60000; // 60 Detik dari sekarang
          localStorage.setItem('auth_cooldown_until', cooldownUntil.toString());
          localStorage.setItem('auth_failed_attempts', '0');
          
          setFailedAttempts(0);
          setCooldown(60);
          setAuthError('Batas percobaan tercapai (5x)! Silakan tunggu 60 detik.');
        } else {
          localStorage.setItem('auth_failed_attempts', newAttempts.toString());
          setFailedAttempts(newAttempts);
          setAuthError(`Access Key salah! Coba lagi (${newAttempts}/5).`);
        }
      }
    } catch (err) {
      console.error("Error verifikasi token:", err);
      setAuthError('Gagal terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setIsVerifyingToken(false);
    }
  };

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'X-API-Key': authToken,
      },
    });

    return res;
  };

  // ---------------- API FETCH FUNCTIONS ----------------

  const fetchFiles = async (query = '', parentId = null, signal = null) => {
    setIsLoading(true);
    try {
      let url = `${API_BASE}/api/files`;
      const params = new URLSearchParams();
      
      if (query) params.append('search', query);
      else if (parentId !== null) params.append('parent_id', parentId);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await authFetch(url, { signal });

      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        setAuthToken('');
        setAuthError('Sesi telah berakhir atau Access Key tidak valid.');
        return;
      }

      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error("Gagal mengambil data file:", err);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStorage = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/storage`);
      const data = await res.json();
      setStorage(data);
    } catch (err) {
      console.error("Gagal mengambil data storage:", err);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!authToken) return;

    const controller = new AbortController();

    fetchFiles(debouncedSearchQuery, currentFolder.id, controller.signal);
    fetchStorage();

    return () => {
      controller.abort();
    };
    
  }, [debouncedSearchQuery, currentFolder.id, authToken]);

  useEffect(() => {
    document.title = `${currentFolder.name} - Bilik UnuyAdi`;
  }, [currentFolder]);

  // ---------------- FOLDER & FILE PREVIEW HANDLERS ----------------

  const handleOpenFolder = (folder) => {
    setSearchQuery('');
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    setSearchQuery('');
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  // Handler saat file diklik untuk Preview
  const handleOpenPreview = async (file) => {
    setPreviewItem(file);
    setTextContent('');
    setIsPreviewLoading(true);
    setPreviewError(false);

    if (file.type === 'text') {
      try {
        const res = await authFetch(`${API_BASE}/api/preview/${file.id}`);
        if (!res.ok) throw new Error("Gagal mengambil file");
        const text = await res.text();
        setTextContent(text);
      } catch (err) {
        setPreviewError(true);
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  // ---------------- SELECT & BULK DELETE HANDLERS ----------------
  
  useEffect(() => {
    setSelectedItemIds([]);
  }, [currentFolder.id, debouncedSearchQuery]);

  const handleSelectItem = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Select All / Deselect All
  const handleSelectAll = () => {
    if (selectedItemIds.length === files.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(files.map((file) => file.id));
    }
  };

  // Handler Hapus Masal
  const handleBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedItemIds.length} item terpilih?`)) return;

    try {
      const res = await authFetch(`${API_BASE}/api/files/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_ids: selectedItemIds }),
      });

      if (res.ok) {
        setSelectedItemIds([]);
        fetchFiles(debouncedSearchQuery, currentFolder.id);
        fetchStorage();
      } else {
        alert("Gagal menghapus item terpilih.");
      }
    } catch (err) {
      console.error("Error bulk delete:", err);
    }
  };

  // ---------------- ACTION HANDLERS & HELPER RENDERS ----------------

  const renderFileIcon = (type, className = "w-5 h-5") => {
    switch (type) {
      case 'folder':
        return <Folder className={`${className} text-amber-500 fill-amber-100`} />;
      case 'pdf':
        return <FileText className={`${className} text-red-500`} />;
      case 'doc':
        return <FileText className={`${className} text-blue-500`} />;
      case 'text':
        return <Code className={`${className} text-indigo-500`} />;
      case 'image':
        return <ImageIcon className={`${className} text-emerald-500`} />;
      case 'ppt':
        return <FileText className={`${className} text-orange-500`} />;
      case 'video':
        return <Video className={`${className} text-purple-500`} />;
      case 'audio':
        return <Music className={`${className} text-pink-500`} />;
      default:
        return <File className={`${className} text-gray-500`} />;
    }
  };

  // Helper Khusus Thumbnail Grid View
  const renderGridThumbnail = (file) => {
    if (file.type === 'image') {
      return <GridImageThumbnail file={file} authToken={authToken} />;
    }

    if (file.is_folder || file.type === 'folder') {
      return (
        <div className="w-full aspect-[4/3] bg-amber-50/50 flex flex-col items-center justify-center gap-2 group-hover:bg-amber-100/50 transition-colors">
          <Folder className="w-10 h-10 text-amber-500 fill-amber-100" />
        </div>
      );
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : file.type.toUpperCase();

    return (
      <div className="w-full aspect-[4/3] bg-gray-50 flex flex-col items-center justify-center gap-2 group-hover:bg-gray-100 transition-colors relative">
        {renderFileIcon(file.type, "w-8 h-8")}
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-white border border-black rounded text-gray-700 shadow-sm">
          {ext}
        </span>
      </div>
    );
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert("Pilih minimal satu file yang valid!");

    setIsUploading(true);
    const THRESHOLD = 5 * 1024 * 1024; // Batas 5 MB

    try {
      for (let fIndex = 0; fIndex < selectedFiles.length; fIndex++) {
        const file = selectedFiles[fIndex];
        setCurrentFileIndex(fIndex + 1);
        setUploadProgress(0);

        if (file.size < THRESHOLD) {
          // --- FILE KECIL (< 5MB): Direct Upload ---
          const formData = new FormData();
          formData.append("file", file);
          if (currentFolder.id !== null) {
            formData.append("parent_id", currentFolder.id);
          }

          const res = await authFetch(`${API_BASE}/api/upload`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`Gagal mengunggah ${file.name}`);
          setUploadProgress(100);

        } else {
          // --- FILE BESAR (>= 5MB): Chunked Upload ---
          const CHUNK_SIZE = THRESHOLD;
          const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
          const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

          for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(file.size, start + CHUNK_SIZE);
            const chunk = file.slice(start, end);

            const chunkData = new FormData();
            chunkData.append("upload_id", uploadId);
            chunkData.append("chunk_index", i);
            chunkData.append("file", chunk, file.name);

            const res = await authFetch(`${API_BASE}/api/upload/chunk`, {
              method: "POST",
              body: chunkData,
            });

            if (!res.ok) throw new Error(`Gagal mengunggah ${file.name} bagian ke-${i + 1}`);

            const progressPercent = Math.round(((i + 1) / totalChunks) * 100);
            setUploadProgress(progressPercent);
          }

          const completeData = new FormData();
          completeData.append("upload_id", uploadId);
          completeData.append("filename", file.name);
          completeData.append("total_chunks", totalChunks);
          if (currentFolder.id !== null) {
            completeData.append("parent_id", currentFolder.id);
          }

          const completeRes = await authFetch(`${API_BASE}/api/upload/complete`, {
            method: "POST",
            body: completeData,
          });

          if (!completeRes.ok) throw new Error(`Gagal menggabungkan file ${file.name}`);
        }
      }

      setSelectedFiles([]);
      setSkippedFiles([]);
      setIsUploadModalOpen(false);
      fetchFiles(searchQuery, currentFolder.id);
      fetchStorage();
      alert("Semua file berhasil diunggah!");
    } catch (err) {
      console.error("Error upload:", err);
      alert(err.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileIndex(0);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const formData = new FormData();
    formData.append("folder_name", newFolderName);
    if (currentFolder.id !== null) {
      formData.append("parent_id", currentFolder.id);
    }

    try {
      const res = await authFetch(`${API_BASE}/api/folders`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setNewFolderName('');
        setIsNewFolderModalOpen(false);
        fetchFiles(searchQuery, currentFolder.id);
      } else {
        alert("Gagal membuat folder");
      }
    } catch (err) {
      console.error("Error create folder:", err);
    }
  };

  const handleDownload = async (id, name = 'download') => {
    try {
      const res = await authFetch(`${API_BASE}/api/download/${id}`);
      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error download:", err);
      alert("Gagal mengunduh file.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) return;

    try {
      const res = await authFetch(`${API_BASE}/api/files/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchFiles(searchQuery, currentFolder.id);
        fetchStorage();
      } else {
        alert("Gagal menghapus item");
      }
    } catch (err) {
      console.error("Error delete:", err);
    }
  };

  const handleFileSelect = (e) => {
    const filesArray = Array.from(e.target.files);
    if (filesArray.length === 0) return;

    const valid = [];
    const invalid = [];

    filesArray.forEach((file) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
      if (DISALLOWED_EXTENSIONS.includes(ext)) {
        invalid.push(file.name);
      } else {
        valid.push(file);
      }
    });

    setSelectedFiles(valid);
    setSkippedFiles(invalid);
  };

  

  if (!authToken) {
    return (
      <AuthScreen
        handleSaveToken={handleSaveToken}
        authError={authError}
        inputToken={inputToken}
        setInputToken={setInputToken}
        cooldown={cooldown}
        isVerifyingToken={isVerifyingToken}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      
      {/* HEADER */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenNewFolderModal={() => setIsNewFolderModalOpen(true)}
      />

      {/* MAIN BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setBreadcrumbs={setBreadcrumbs}
          storage={storage}
        />

        {/* MAIN WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* BREADCRUMB & TOOLBAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight overflow-x-auto whitespace-nowrap pb-1 md:pb-0">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id || 'root'}>
                  {idx > 0 && <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />}
                  <button
                    onClick={() => handleBreadcrumbClick(idx)}
                    className={`hover:underline truncate ${
                      idx === breadcrumbs.length - 1 ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border-2 border-black rounded w-full md:w-64 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <button className="border-2 border-black p-1.5 rounded hover:bg-gray-100 flex-shrink-0">
                <Filter className="w-5 h-5" />
              </button>

              <div className="flex items-center border-2 border-black rounded overflow-hidden flex-shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 transition-colors border-l border-black ${
                    viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* FLOATING ACTION BAR */}
          {selectedItemIds.length > 0 && (
            <div className="mb-4 p-3 bg-gray-900 text-white rounded-lg flex items-center justify-between shadow-md">
              <span className="text-sm font-semibold pl-1">
                {selectedItemIds.length} item terpilih
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItemIds([])}
                  className="px-3 py-1 text-xs border border-gray-500 rounded hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-xs bg-red-600 text-white font-bold rounded hover:bg-red-700 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Pilihan
                </button>
              </div>
            </div>
          )}

          {/* MAIN FILE LIST / GRID */}
          {isLoading ? (
            <div className="border border-black rounded p-12 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>Memuat data...</span>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="border border-black rounded p-12 text-center text-gray-500">
              Folder ini kosong.
            </div>
          ) : viewMode === 'list' ? (
            <FileList
              files={files}
              selectedItemIds={selectedItemIds}
              handleSelectAll={handleSelectAll}
              handleSelectItem={handleSelectItem}
              handleOpenFolder={handleOpenFolder}
              handleOpenPreview={handleOpenPreview}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              renderFileIcon={renderFileIcon}
            />
          ) : (
            <FileGrid
              files={files}
              selectedItemIds={selectedItemIds}
              handleSelectItem={handleSelectItem}
              handleOpenFolder={handleOpenFolder}
              handleOpenPreview={handleOpenPreview}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              renderFileIcon={renderFileIcon}
              renderGridThumbnail={renderGridThumbnail}
            />
          )}
        </main>
      </div>

      {/* ------------ MODALS ------------ */}
      {/* MODAL PREVIEW FILE */}
      <FilePreviewModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
        authToken={authToken}
        isPreviewLoading={isPreviewLoading}
        setIsPreviewLoading={setIsPreviewLoading}
        previewError={previewError}
        setPreviewError={setPreviewError}
        textContent={textContent}
        handleOpenPreview={handleOpenPreview}
        handleDownload={handleDownload}
        renderFileIcon={renderFileIcon}
      />

      {/* MODAL UPLOAD FILE */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentFolderName={currentFolder.name}
        isUploading={isUploading}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        skippedFiles={skippedFiles}
        setSkippedFiles={setSkippedFiles}
        currentFileIndex={currentFileIndex}
        uploadProgress={uploadProgress}
        handleUploadSubmit={handleUploadSubmit}
      />

      {/* MODAL NEW FOLDER */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        currentFolderName={currentFolder.name}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
      />
      
    </div>
  );
}