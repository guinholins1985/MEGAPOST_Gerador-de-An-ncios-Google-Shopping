
import React from 'react';
import type { GeneratedAd } from '../types';

interface AdPreviewCardProps {
    adData: GeneratedAd;
}

export const AdPreviewCard: React.FC<AdPreviewCardProps> = ({ adData }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">Pré-visualização do Anúncio</h3>
                <div className="max-w-xs mx-auto bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <img
                        src={adData.imageUrl}
                        alt="Pré-visualização do produto"
                        className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm leading-tight truncate">
                        {adData.title}
                    </h4>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        R$ 99,99
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        nome-da-loja.com
                    </p>
                </div>
            </div>
        </div>
    );
};
