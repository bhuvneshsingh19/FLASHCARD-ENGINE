"use client";
import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error("Only PDF files are supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB Limit
      toast.error("File is too large (Max 10MB)");
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
    toast.success("File ready for processing");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group transition-all duration-300 rounded-[32px] border-2 border-dashed p-12 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white hover:border-blue-300'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="pdf-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={isProcessing}
        />

        {!selectedFile ? (
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Upload className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
              Drop your study material here
            </h3>
            <p className="text-gray-500 mb-2">or click to browse your files</p>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">
              <CheckCircle2 size={14} className="text-green-500" />
              <span>PDF up to 10MB</span>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
                <FileText className="text-white" size={32} />
              </div>
              <button 
                onClick={removeFile}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate max-w-[300px]">
              {selectedFile.name}
            </h3>
            <p className="text-sm text-blue-600 font-semibold mt-1">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 rounded-[32px] backdrop-blur-[2px] flex flex-col items-center justify-center z-10 animate-in fade-in duration-500">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-lg font-bold text-gray-900">Uploading Document...</p>
          </div>
        )}
      </div>
    </div>
  );
}