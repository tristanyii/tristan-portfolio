"use client";

import { useState, useRef } from "react";
import { useAdmin } from "./admin-provider";
import { Upload, ImagePlus } from "lucide-react";

interface Props {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
}

export function EditableImage({ contentKey, defaultSrc, alt, className = "" }: Props) {
  const { isAdmin, getContent, setContent } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const src = getContent(contentKey, defaultSrc);
  const hasImage = src && src.length > 0;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setContent(contentKey, base64);
        setUploading(false);
      };
      reader.onerror = () => setUploading(false);
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  if (!isAdmin) {
    if (!hasImage) return null;
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative group inline-flex">
      {hasImage ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className={`${className} flex items-center justify-center bg-muted/30 border border-dashed border-primary/30 rounded-md min-w-[2.5rem] min-h-[2.5rem]`}>
          <ImagePlus className="w-4 h-4 text-primary/40" />
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); fileRef.current?.click(); }}
        disabled={uploading}
        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
      >
        {uploading ? (
          <span className="text-white text-[10px] font-medium">...</span>
        ) : (
          <Upload className="w-3.5 h-3.5 text-white" />
        )}
      </button>
    </div>
  );
}
