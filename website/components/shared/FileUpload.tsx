'use client';

import { useRef, useState, useCallback, useId } from 'react';
import Image from 'next/image';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  onFileChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  label = 'Upload File',
  accept,
  onFileChange,
  className,
  disabled,
}: FileUploadProps) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [urlFocused, setUrlFocused] = useState(false);

  const simulateUpload = useCallback(
    (f: File) => {
      setFile(f);
      setUploading(true);
      setProgress(0);
      onFileChange?.(f);
      let p = 0;
      const iv = setInterval(() => {
        p += 10;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(iv);
          setUploading(false);
        }
      }, 300);
    },
    [onFileChange],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) simulateUpload(f);
  };

  const cancel = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    onFileChange?.(null);
  };

  const uploadUrl = () => {
    if (!urlValue.trim() || disabled) return;
    const name = urlValue.split('/').pop() ?? 'file';
    simulateUpload(new File([], name));
    setUrlValue('');
  };

  const dropZoneClasses = [
    'border border-dashed rounded-lg h-36 flex flex-col items-center justify-center gap-2 transition-colors select-none',
    disabled
      ? 'border-[#525252] opacity-50 cursor-not-allowed'
      : uploading
      ? 'border-[#eb0028] bg-[#1a1a1a] cursor-default'
      : isDragOver
      ? 'border-[#eb0028] bg-[rgba(235,0,40,0.08)] cursor-copy'
      : 'border-[#525252] hover:border-[#eb0028] bg-[rgba(235,0,40,0.03)] cursor-pointer',
  ].join(' ');

  return (
    <div
      className={`bg-[#1a1a1a] flex flex-col gap-[14px] p-6 shadow-[1px_1px_1px_rgba(181,181,181,0.25),-1px_-1px_1px_rgba(181,181,181,0.25)] ${className ?? ''}`}
    >
      <p className="text-white font-helvetica text-base leading-normal">{label}</p>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Drop file here or click to browse"
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !uploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={dropZoneClasses}
      >
        {uploading ? (
          <>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(190,190,190,0.3)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16" fill="none" stroke="#eb0028" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16 * progress / 100} ${2 * Math.PI * 16}`}
                strokeLinecap="round" transform="rotate(-90 20 20)"
                className="transition-all duration-300"
              />
            </svg>
            <p className="text-white font-helvetica text-xs">Uploading file...</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cancel(); }}
              className="border border-[#eb0028] text-[#eb0028] text-[9px] font-helvetica tracking-[0.15px] px-3 py-1 uppercase hover:bg-[#eb0028]/10 transition-colors"
            >
              CANCEL
            </button>
          </>
        ) : (
          <>
            {/* Upload icon with dashed border */}
            <div className="border border-dashed border-[#eb0028] rounded-lg p-2.5">
              <Image
                src="/images/icons/upload-icon.png"
                alt="Upload"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <p className="text-white font-helvetica text-xs">
              {file ? file.name : 'select a file to upload'}
            </p>
            {!file && (
              <p className="text-[#525252] font-helvetica text-[10px]">or drag and drop it here</p>
            )}
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) simulateUpload(f);
          e.target.value = '';
        }}
      />

      {/* Uploaded file info */}
      {file && !uploading && (
        <div className="border border-[rgba(181,181,181,0.15)] rounded-sm px-3 py-2.5 flex items-center gap-3">
          <Image
            src="/images/icons/file-icon.png"
            alt="File"
            width={24}
            height={24}
            className="object-contain shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-helvetica truncate">{file.name}</p>
            {file.size > 0 && (
              <p className="text-[#999] text-[10px] font-helvetica">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={cancel}
            className="text-[#999] hover:text-[#eb0028] transition-colors shrink-0 ml-auto"
            aria-label="Remove file"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* URL upload */}
      <p className="text-white font-helvetica text-xs leading-normal">or upload from URL</p>
      <div className="flex items-end gap-2">
        <div className="flex-1 flex flex-col gap-0">
          <div className="px-[10px] py-[6px]">
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onFocus={() => setUrlFocused(true)}
              onBlur={() => setUrlFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && uploadUrl()}
              placeholder="Add file URL"
              disabled={disabled || uploading}
              className="w-full bg-transparent border-none outline-none font-helvetica text-base caret-[#eb0028] placeholder:text-[rgba(255,255,255,0.35)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className={`h-px w-full transition-colors ${urlFocused ? 'bg-[#eb0028]' : 'bg-[#525252]'}`} />
        </div>
        <button
          type="button"
          onClick={uploadUrl}
          disabled={disabled || uploading || !urlValue.trim()}
          className={`h-7 px-4 text-[9px] tracking-[0.15px] uppercase font-helvetica shrink-0 transition-colors border ${
            disabled || uploading || !urlValue.trim()
              ? 'border-[#525252] text-[#525252] cursor-not-allowed'
              : 'border-[#eb0028] text-[#eb0028] hover:bg-[#eb0028]/10'
          }`}
        >
          UPLOAD
        </button>
      </div>
    </div>
  );
}
