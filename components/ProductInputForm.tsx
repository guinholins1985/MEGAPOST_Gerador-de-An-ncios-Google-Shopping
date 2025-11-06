import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProductInputFormProps {
    productName: string;
    setProductName: (value: string) => void;
    productDetails: string;
    setProductDetails: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    productUrl: string;
    setProductUrl: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    analysisError: string | null;
    imagePreview: string | null;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export const ProductInputForm: React.FC<ProductInputFormProps> = ({
    productName,
    setProductName,
    productDetails,
    setProductDetails,
    targetAudience,
    setTargetAudience,
    productUrl,
    setProductUrl,
    onSubmit,
    isLoading,
    onAnalyze,
    isAnalyzing,
    analysisError,
    imagePreview,
    onFileChange,
    onRemoveImage,
}) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 p-4 bg-slate-100 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Preenchimento Automático com IA</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Envie uma imagem ou cole um link para que a IA preencha os campos abaixo para você.
              </p>
              
              <div>
                <label htmlFor="product-url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Link do Produto (Marketplace)
                </label>
                <input
                    type="url"
                    id="product-url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://www.nomedaloja.com/produto/..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isAnalyzing}
                />
              </div>

              <div className="flex items-center">
                <hr className="flex-grow border-slate-300 dark:border-slate-600" />
                <span className="mx-2 text-xs font-semibold text-slate-500 dark:text-slate-400">OU</span>
                <hr className="flex-grow border-slate-300 dark:border-slate-600" />
              </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Imagem do Produto
                    </label>
                    {imagePreview ? (
                        <div className="mt-2 group relative">
                            <img src={imagePreview} alt="Pré-visualização do produto" className="w-full h-auto max-h-60 object-contain rounded-lg border border-slate-300 dark:border-slate-600" />
                            <button
                                type="button"
                                onClick={onRemoveImage}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-opacity opacity-0 group-hover:opacity-100"
                                aria-label="Remover imagem"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 focus-within:ring-blue-500">
                                        <span>Carregue um arquivo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" disabled={isAnalyzing} />
                                    </label>
                                    <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, WEBP até 4MB</p>
                            </div>
                        </div>
                    )}
                </div>

              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing || (!imagePreview && !productUrl)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isAnalyzing ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando...
                    </>
                ) : (
                    "Analisar e Preencher Campos"
                )}
              </button>
              {analysisError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{analysisError}</p>}
            </div>

            <hr className="my-6 border-slate-300 dark:border-slate-700" />

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detalhes do Produto</h2>
            <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Tênis de Corrida Ultra Leve"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="product-details" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Características e Detalhes <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="product-details"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    rows={5}
                    placeholder="Descreva os principais recursos, materiais, cores, tamanhos, etc."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
             <div>
                <label htmlFor="target-audience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Público-Alvo (Opcional)
                </label>
                <input
                    type="text"
                    id="target-audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Corredores iniciantes, entusiastas da moda"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isLoading ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gerando...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5"/>
                        Gerar Anúncio
                    </>
                )}
            </button>
        </form>
    );
};