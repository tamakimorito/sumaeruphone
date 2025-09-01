
import React, { useState, useCallback, useEffect } from 'react';
import { InputWithLabel } from './components/InputWithLabel.tsx';
import { CallButton } from './components/CallButton.tsx';
import { SearchableSelect } from './components/SearchableSelect.tsx';
import { Modal } from './components/Modal.tsx';

const parseCsv = (csvText) => {
    return csvText
    .trim()
    .split('\n')
    .map(line => {
        const [name, number] = line.split(',');
        return { name: (name || '').trim(), number: (number || '').trim() };
    })
    .filter(item => item.name && item.number);
};

const convertToE164 = (phoneNumber) => {
    if (!phoneNumber) return '';
    let cleaned = phoneNumber.trim().replace(/-/g, '');
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
    if (cleaned.startsWith('0')) {
        return `+81${cleaned.substring(1)}`;
    }
    return cleaned;
};


export const App = () => {
    const [dest, setDest] = useState('');
    const [srcDisplay, setSrcDisplay] = useState('');
    const [actualSrcNumber, setActualSrcNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [callInfo, setCallInfo] = useState(null);

    const [phonebook, setPhonebook] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    useEffect(() => {
        const fetchSheetData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const sheetUrl = 'https://docs.google.com/spreadsheets/d/17PDf8JgvImNomHr2kcyrGxrt3JKD5wyspSHrGmf80Zw/export?format=csv&gid=0';
            const response = await fetch(sheetUrl);
            if (!response.ok) {
            throw new Error(`データの取得に失敗しました: ${response.statusText}`);
            }
            const csvText = await response.text();
            const parsedData = parseCsv(csvText);
            setPhonebook(parsedData);
        } catch (e) {
            if (e instanceof Error) {
            setError(e.message);
            } else {
            setError('不明なエラーが発生しました。');
            }
            console.error(e);
        } finally {
            setIsLoading(false);
        }
        };

        fetchSheetData();
    }, []);
    
    useEffect(() => {
        if (!srcDisplay) {
            setActualSrcNumber('');
            return;
        }
        const selectedOption = phonebook.find(p => p.name === srcDisplay.trim());
        const finalSrc = selectedOption ? selectedOption.number : srcDisplay;
        setActualSrcNumber(finalSrc.trim());
    }, [srcDisplay, phonebook]);


    const handleCallRequest = useCallback(() => {
        const finalSrcNumber = actualSrcNumber.trim();
        const finalSrcDisplay = srcDisplay.trim();

        const cleanedDest = dest.trim().replace(/-/g, '');
        const cleanedSrc = finalSrcNumber.replace(/-/g, '');
        
        const isNumericRegex = /^[0-9+]+$/;

        if (cleanedDest === '' || cleanedSrc === '' || !isNumericRegex.test(cleanedDest) || !isNumericRegex.test(cleanedSrc)) {
        alert('宛先と発信元の電話番号を正しく入力または選択してください。電話番号には半角数字と+のみ使用できます。');
        return;
        }

        setCallInfo({
            dest: dest.trim(),
            srcDisplay: finalSrcDisplay || finalSrcNumber,
            srcNumber: finalSrcNumber
        });
        setIsModalOpen(true);
    }, [dest, srcDisplay, actualSrcNumber]);

    const confirmCall = useCallback(() => {
        if (!callInfo) return;
        
        const e164Dest = convertToE164(callInfo.dest);
        const e164Src = convertToE164(callInfo.srcNumber);
        
        const callUrl = `zoomphonecall://${encodeURIComponent(e164Dest)}?callerid=${encodeURIComponent(e164Src)}`;
        
        window.location.href = callUrl;
        
        setIsModalOpen(false);
        setCallInfo(null);
    }, [callInfo]);

    const cancelCall = () => {
        setIsModalOpen(false);
        setCallInfo(null);
    };

    const handleSrcSelect = (option) => {
        setSrcDisplay(option.name);
    };
    
    const handleSrcChange = (value) => {
        setSrcDisplay(value);
    };

    const handleInstallClick = async () => {
      if (!installPrompt) {
          return;
      }
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
      } else {
          console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
  };

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-3xl">
          <Modal
            isOpen={isModalOpen}
            onClose={cancelCall}
            onConfirm={confirmCall}
            title="発信内容の確認"
          >
            {callInfo && (
              <div className="space-y-2">
                <p className="flex items-baseline">
                  <span className='font-semibold text-slate-500 w-24 flex-shrink-0'>宛先:</span>
                  <strong className='text-lg text-indigo-600 truncate'>{callInfo.dest || '未入力'}</strong>
                </p>
                <p className="flex items-baseline">
                  <span className='font-semibold text-slate-500 w-24 flex-shrink-0'>発信元:</span>
                  <strong className='text-lg text-indigo-600 truncate'>{`${callInfo.srcDisplay || '未入力'} (${callInfo.srcNumber || '不明'})`}</strong>
                </p>
              </div>
            )}
          </Modal>
          <div className="bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-4 rounded-2xl shadow-2xl w-full border border-gray-200 selection:bg-indigo-100 selection:text-indigo-700">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <InputWithLabel
                  id="dest"
                  label="発信先（電話番号）"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="例: 09012345678"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-describedby="dest-description"
                />
                <div className="h-5 mt-2" />
              </div>
              <div className="flex-1">
                <SearchableSelect
                  id="src"
                  label="発信元（表示する番号）"
                  value={srcDisplay}
                  options={phonebook}
                  onChange={handleSrcChange}
                  onSelect={handleSrcSelect}
                  placeholder={isLoading ? "リストを読み込み中..." : "名前で検索または番号を入力"}
                  disabled={isLoading || !!error}
                  aria-describedby="src-description"
                />
                <div className="h-5 mt-2">
                  {error ? 
                    <p className="text-xs text-red-600 text-left">{error}</p>
                    : actualSrcNumber && <p className="text-xs text-slate-500 text-left">
                      発信に使用する番号: <strong className='text-slate-700'>{actualSrcNumber}</strong>
                    </p>
                  }
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                  <label className="block text-xs text-slate-500 mb-1">すまえるフォン</label>
                  <CallButton
                    onClick={handleCallRequest}
                    disabled={!dest || !actualSrcNumber}
                    className="w-full md:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5A1.5 1.5 0 0 1 16.5 18H16a13.5 13.5 0 0 1-13.5-13.5V3.5Z" />
                    </svg>
                    発信
                  </CallButton>
              </div>
            </div>
            <p id="dest-description" className="sr-only">発信先の電話番号を入力してください。</p>
            <p id="src-description" className="sr-only">発信元として表示する電話番号を検索、選択、または入力してください。</p>
            <footer className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
                <div className='text-left'>
                    <p className='mb-1'>この情報は、デバイスの通話アプリに安全に送信されます。ウェブページには保存されません。</p>
                    <p>© 2025 タマシステム</p>
                </div>
                {installPrompt && (
                    <button
                        onClick={handleInstallClick}
                        className="flex items-center gap-2 ml-4 px-4 py-2 bg-slate-100 text-slate-800 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out"
                        title="アプリをインストール"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>インストール</span>
                    </button>
                )}
            </footer>
          </div>
        </div>
      </div>
    );
};