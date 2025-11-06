import React, { useEffect, useState } from 'react';
import type { GeneratedAd } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ActionToolbarProps {
    adData: GeneratedAd;
    isCopied: boolean;
    onCopy: () => void;
    onDownload: () => void;
    onShare: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ adData, isCopied, onCopy, onDownload, onShare }) => {
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setCanShare(true);
        }
    }, []);

    const buttonClass = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-blue-500 transition-colors";

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onCopy}
                className={`${buttonClass} ${isCopied ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''}`}
            >
                {isCopied ? (
                    <>
                        <CheckIcon className="w-4 h-4" />
                        Copiado!
                    </>
                ) : (
                    <>
                        <ClipboardIcon className="w-4 h-4" />
                        Copiar Tudo
                    </>
                )}
            </button>
            <button onClick={onDownload} className={buttonClass} aria-label="Baixar anúncio">
                <DownloadIcon className="w-4 h-4" />
            </button>
            {canShare && (
                <button onClick={onShare} className={buttonClass} aria-label="Compartilhar">
                    <ShareIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
