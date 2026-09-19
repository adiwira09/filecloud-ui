import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthScreen({
  handleSaveToken,
  authError,
  inputToken,
  setInputToken,
  cooldown,
  isVerifyingToken,
}) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gray-50 flex items-center justify-center p-4 py-8 overflow-y-auto">
      <form 
        onSubmit={handleSaveToken} 
        className="bg-white p-6 sm:p-8 rounded-lg border-2 border-black max-w-sm w-full shadow-sm"
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold text-black tracking-tight">
            Masuk ke Bilik UnuyAdi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Masukkan Access Key untuk mengakses file Anda.
          </p>
        </div>

        {authError && (
          <div 
            role="alert"
            className="mb-5 p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-medium rounded leading-relaxed"
          >
            {authError}
          </div>
        )}

        <div className="mb-6">
          <label 
            htmlFor="access-key" 
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Access Key
          </label>
          <input
            id="access-key"
            type="password"
            placeholder="Ketik Access Key..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            disabled={cooldown > 0 || isVerifyingToken}
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="go"
            className="w-full border-2 border-black rounded px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={cooldown > 0 || isVerifyingToken || !inputToken.trim()}
          className="w-full bg-black text-white font-semibold py-2.5 rounded text-sm hover:bg-gray-800 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:border-transparent disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
        >
          {isVerifyingToken ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : cooldown > 0 ? (
            `Coba lagi dalam ${cooldown}s`
          ) : (
            'Masuk'
          )}
        </button>
      </form>
    </div>
  );
}