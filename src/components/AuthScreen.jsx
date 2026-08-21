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
    <div className="min-h-screen min-h-[100dvh] bg-gray-100 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSaveToken} 
        className="bg-white p-5 sm:p-6 rounded-lg border-2 border-black max-w-sm w-full shadow-lg"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-1">Bilik UnuyAdi Protection</h2>
        <p className="text-xs text-gray-600 mb-4">Masukkan Access Key untuk melanjutkan.</p>

        {authError && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs font-semibold rounded leading-relaxed">
            {authError}
          </div>
        )}

        <input
          type="password"
          placeholder="Access Key..."
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          disabled={cooldown > 0 || isVerifyingToken}
          className="w-full border-2 border-black rounded p-2.5 sm:p-2 text-base sm:text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={cooldown > 0 || isVerifyingToken || !inputToken.trim()}
          className="w-full bg-black text-white font-bold py-2.5 sm:py-2 rounded text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isVerifyingToken ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : cooldown > 0 ? (
            `Tunggu ${cooldown} Detik`
          ) : (
            'Masuk'
          )}
        </button>
      </form>
    </div>
  );
}