"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Sparkles, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [loadingStep, setLoadingStep] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
    }
  };

  const processPDF = async () => {
    if (!file) return;

    setStatus('processing');
    setLoadingStep('Extracting knowledge from PDF...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 1. Extraction Phase
      const extractRes = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!extractRes.ok) throw new Error("Could not read PDF");
      const { text } = await extractRes.json();

      // 2. Generation Phase
      setLoadingStep('AI is generating teacher-quality cards...');
      
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          title: file.name.replace('.pdf', ''),
          description: `Analysis of ${file.name}`
        }),
      });

      if (!generateRes.ok) throw new Error("AI generation failed");
      const deck = await generateRes.json();
      
      toast.success("Deck created! Ready to study.");
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* Navigation Back */}
      <div className="absolute top-8 left-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Library</span>
        </Link>
      </div>

      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 p-10 border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Sparkles className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Deck</h1>
          <p className="text-gray-500 mt-2">Upload your notes and let AI do the heavy lifting.</p>
        </div>

        {status === 'processing' ? (
          <div className="py-16 flex flex-col items-center">
            <div className="relative">
              <Loader2 className="animate-spin text-blue-600 mb-6" size={56} />
              <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse rounded-full"></div>
            </div>
            <p className="text-xl font-semibold text-gray-800 text-center">{loadingStep}</p>
            <p className="text-sm text-gray-400 mt-3 font-medium">This might take a moment for larger files...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <label className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-200 rounded-[24px] cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                {file ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200 mb-4">
                      <FileText className="text-white" size={40} />
                    </div>
                    <p className="text-lg font-bold text-gray-800 truncate max-w-[250px]">{file.name}</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1 uppercase tracking-wider">File Selected</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 group-hover:bg-blue-100 p-4 rounded-2xl mb-4 transition-colors">
                      <Upload className="text-gray-400 group-hover:text-blue-600 transition-colors" size={32} />
                    </div>
                    <p className="text-lg text-gray-700 font-bold">Drop your PDF here</p>
                    <p className="text-sm text-gray-400 mt-2 font-medium">or click to browse from your device</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>

            <button
              onClick={processPDF}
              disabled={!file}
              className={`w-full py-5 rounded-[20px] font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                file 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={22} />
              <span className="text-lg">Magic Generate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}