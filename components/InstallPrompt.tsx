
import React, { useEffect, useRef, useState } from 'react';

export const InstallPrompt = () => {
  const deferredRef = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone;
    if (isStandalone) {
      setInstalled(true);
      return;
    }
    const handler = (e: any) => {
      e.preventDefault();
      deferredRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => setInstalled(true);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const onClick = async () => {
    if (!deferredRef.current) return;
    deferredRef.current.prompt();
    await deferredRef.current.userChoice;
    deferredRef.current = null;
    setCanInstall(false);
  };

  if (installed || !canInstall) return null;

  return (
    <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg mb-4 flex items-center justify-between animate-fade-in-scale">
      <p className="font-semibold text-sm sm:text-base">このアプリをホーム画面に追加しますか？</p>
      <button
        onClick={onClick}
        className="flex-shrink-0 flex items-center gap-2 ml-4 px-3 py-2 sm:px-4 sm:py-2 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150 ease-in-out text-sm"
        title="アプリをインストール"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">インストール</span>
      </button>
    </div>
  );
};
