
import React from 'react';
import type { ComplianceResult } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface ComplianceResultDisplayProps {
    compliance: ComplianceResult;
}

export const ComplianceResultDisplay: React.FC<ComplianceResultDisplayProps> = ({ compliance }) => {
    const isApproved = compliance.status === 'approved';

    const baseClasses = "p-6 rounded-2xl shadow-lg border";
    const statusClasses = isApproved 
        ? "bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700" 
        : "bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700";
    
    const icon = isApproved 
        ? <CheckCircleIcon className="w-8 h-8 text-green-500" />
        : <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />;

    const titleText = isApproved ? "Conformidade Aprovada" : "Revisão Necessária";
    const titleClasses = isApproved 
        ? "text-green-800 dark:text-green-200"
        : "text-yellow-800 dark:text-yellow-200";

    const feedbackClasses = isApproved
        ? "text-green-700 dark:text-green-300"
        : "text-yellow-700 dark:text-yellow-300";

    return (
        <div className={`${baseClasses} ${statusClasses}`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-xl font-bold ${titleClasses}`}>{titleText}</h3>
                    <p className={`mt-2 text-sm ${feedbackClasses}`}>
                        {compliance.feedback}
                    </p>
                </div>
            </div>
        </div>
    );
};
