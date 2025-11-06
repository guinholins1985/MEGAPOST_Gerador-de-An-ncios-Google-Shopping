import React, { useState, useCallback } from 'react';
import { generateAdContent, analyzeProduct } from './services/geminiService';
import type { GeneratedAd, ComplianceResult } from './types';
import { ProductInputForm } from './components/ProductInputForm';
import { AdPreviewCard } from './components/AdPreviewCard';
import { ComplianceResultDisplay } from './components/ComplianceResultDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ActionToolbar } from './components/ActionToolbar';

const App: React.FC = () => {
    const [productName, setProductName] = useState<string>('');
    const [productDetails, setProductDetails] = useState<string>('');
    const [targetAudience, setTargetAudience] = useState<string>('');
    const [productUrl, setProductUrl] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);


    const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
    const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };
    
    const handleAnalyzeProduct = useCallback(async () => {
        if (!imageFile && !productUrl) {
            setAnalysisError("Por favor, envie uma imagem ou insira um link para analisar.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);
        setError(null);

        try {
            let imagePart;
            if (imageFile && imagePreview) {
                const [header, base64Data] = imagePreview.split(',');
                const mimeType = header.match(/:(.*?);/)?.[1];

                if (base64Data && mimeType) {
                    imagePart = {
                        data: base64Data,
                        mimeType: mimeType,
                    };
                }
            }

            const result = await analyzeProduct(imagePart, productUrl.trim());

            setProductName(result.productName);
            setProductDetails(result.productDetails);
            setTargetAudience(result.targetAudience);

        } catch (err) {
            console.error(err);
            setAnalysisError("Ocorreu um erro ao analisar o produto. Tente novamente.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [imageFile, imagePreview, productUrl]);

    const handleGenerateAd = useCallback(async () => {
        if (!productName || !productDetails) {
            setError("Por favor, preencha o nome e os detalhes do produto.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedAd(null);
        setComplianceResult(null);

        try {
            let imagePart;
            if (imageFile && imagePreview) {
                const [header, base64Data] = imagePreview.split(',');
                const mimeType = header.match(/:(.*?);/)?.[1];

                if (base64Data && mimeType) {
                    imagePart = {
                        data: base64Data,
                        mimeType: mimeType,
                    };
                }
            }

            const result = await generateAdContent(productName, productDetails, targetAudience, imagePart);
            
            setGeneratedAd({
                title: result.title,
                description: result.description,
                category: result.category,
                imageUrl: imagePreview || `https://picsum.photos/seed/${encodeURIComponent(result.title)}/600/600`
            });
            setComplianceResult(result.compliance);

        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao gerar o anúncio. Verifique sua chave de API e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [productName, productDetails, targetAudience, imageFile, imagePreview]);

    const getAdContentAsText = useCallback(() => {
        if (!generatedAd) return '';
        return `Título do Anúncio:\n${generatedAd.title}\n\nDescrição:\n${generatedAd.description}\n\nCategoria Sugerida:\n${generatedAd.category}`;
    }, [generatedAd]);

    const handleCopyAll = useCallback(() => {
        const textToCopy = getAdContentAsText();
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [getAdContentAsText]);

    const handleDownload = useCallback(() => {
        const textToDownload = getAdContentAsText();
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeFilename = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `anuncio-shopping-${safeFilename || 'produto'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [getAdContentAsText, productName]);

    const handleShare = useCallback(async () => {
        if (navigator.share && generatedAd) {
            try {
                await navigator.share({
                    title: `Anúncio para: ${generatedAd.title}`,
                    text: `Confira o conteúdo do anúncio gerado para "${generatedAd.title}":\n\n${generatedAd.description}`,
                });
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
        }
    }, [generatedAd]);


    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            Gerador de Anúncios Google Shopping
                        </h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <ProductInputForm
                            productName={productName}
                            setProductName={setProductName}
                            productDetails={productDetails}
                            setProductDetails={setProductDetails}
                            targetAudience={targetAudience}
                            setTargetAudience={setTargetAudience}
                            productUrl={productUrl}
                            setProductUrl={setProductUrl}
                            onSubmit={handleGenerateAd}
                            isLoading={isLoading}
                            onAnalyze={handleAnalyzeProduct}
                            isAnalyzing={isAnalyzing}
                            analysisError={analysisError}
                            imagePreview={imagePreview}
                            onFileChange={handleFileChange}
                            onRemoveImage={handleRemoveImage}
                        />
                    </div>
                    
                    <div className="space-y-8">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">Otimizando seu anúncio...</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Aguarde, a IA está trabalhando.</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-r-lg" role="alert">
                                <p className="font-bold">Erro</p>
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {generatedAd && complianceResult && !isLoading && (
                            <>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resultado Otimizado</h2>
                                         <ActionToolbar
                                            adData={generatedAd}
                                            isCopied={isCopied}
                                            onCopy={handleCopyAll}
                                            onDownload={handleDownload}
                                            onShare={handleShare}
                                        />
                                    </div>
                                    <AdPreviewCard adData={generatedAd} />
                                </div>
                                
                                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Título Otimizado</h3>
                                        <p className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md font-mono text-sm">{generatedAd.title}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Descrição Otimizada</h3>
                                        <p className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{generatedAd.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Categoria Sugerida</h3>
                                        <p className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md font-mono text-sm">{generatedAd.category}</p>
                                    </div>
                                </div>

                                <ComplianceResultDisplay compliance={complianceResult} />
                            </>
                        )}

                        {!isLoading && !generatedAd && !error && (
                            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="text-center">
                                    <SparklesIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                                    <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Aguardando seu produto</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preencha os detalhes ao lado e gere seu anúncio otimizado.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;