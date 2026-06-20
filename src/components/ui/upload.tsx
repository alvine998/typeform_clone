"use client";

import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Upload as UploadIcon, File, X, ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadFile {
  file: File;
  id: string;
  preview?: string;
}

export interface UploadProps {
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/"))
    return <ImageIcon className="h-5 w-5 text-purple-500" />;
  return <FileText className="h-5 w-5 text-blue-500" />;
}

function Upload({
  value = [],
  onChange,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx",
  multiple = false,
  label,
  error,
  helperText,
  className,
}: UploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadFile[] = [];
      const files = Array.from(fileList);

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) continue;
        const uploadFile: UploadFile = {
          file,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        };
        if (file.type.startsWith("image/")) {
          uploadFile.preview = URL.createObjectURL(file);
        }
        newFiles.push(uploadFile);
      }

      onChange?.(multiple ? [...value, ...newFiles] : newFiles);
    },
    [value, onChange, multiple]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      const updated = value.filter((f) => {
        if (f.id === id && f.preview) URL.revokeObjectURL(f.preview);
        return f.id !== id;
      });
      onChange?.(updated);
    },
    [value, onChange]
  );

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          className={cn(
            "mb-1.5 block text-sm font-medium",
            error ? "text-red-500" : "text-gray-700"
          )}
        >
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          dragOver
            ? "border-purple-500 bg-purple-50"
            : error
            ? "border-red-300 hover:border-red-400"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
        <UploadIcon
          className={cn(
            "mx-auto h-10 w-10 transition-colors",
            dragOver ? "text-purple-500" : "text-gray-400"
          )}
        />
        <p className="mt-3 text-sm font-medium text-gray-700">
          Drop files here or{" "}
          <span className="text-purple-600">browse</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Max file size: 10MB
        </p>
      </div>

      {/* File list */}
      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                getFileIcon(f.file)
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {f.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(f.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(error || helperText) && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            error ? "text-red-500" : "text-gray-500"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export { Upload };
