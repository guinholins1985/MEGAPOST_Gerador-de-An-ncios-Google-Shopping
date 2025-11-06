export interface GeneratedAd {
    title: string;
    description: string;
    category: string;
    imageUrl: string;
}

export interface ComplianceResult {
    status: 'approved' | 'review_needed';
    feedback: string;
}

export interface GeminiAdResponse {
    title: string;
    description: string;
    category: string;
    compliance: ComplianceResult;
}

export interface ProductAnalysis {
    productName: string;
    productDetails: string;
    targetAudience: string;
}
