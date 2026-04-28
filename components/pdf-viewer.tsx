"use client";

import { useState, useEffect } from "react";
import { ZohoFile } from "@/lib/zoho-crm";

interface LeadFiles {
  files: ZohoFile[];
  recordId: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfViewer({
  recordId,
  initialFiles,
}: {
  recordId: string;
  initialFiles?: LeadFiles;
}) {
  const [files, setFiles] = useState<ZohoFile[]>(initialFiles?.files || []);
  const [selectedFile, setSelectedFile] = useState<ZohoFile | null>(
    initialFiles?.files?.[0] || null,
  );
  const [loading, setLoading] = useState(!initialFiles);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!initialFiles) {
      fetch(`/api/lead/${recordId}`)
        .then((res) => res.json())
        .then((data: LeadFiles) => {
          const files = data?.files || [];
          setFiles(files);
          if (files.length > 0) {
            setSelectedFile(files[0]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch files:", err);
          setLoading(false);
        });
    }
  }, [recordId, initialFiles]);

  useEffect(() => {
    if (selectedFile) {
      setPdfUrl(`/api/pdf/${recordId}/${selectedFile.id}`);
    } else {
      setPdfUrl(null);
    }
  }, [selectedFile, recordId]);

  const handleDownload = () => {
    if (!selectedFile) return;
    window.open(
      `/api/pdf/${recordId}/${selectedFile.id}?download=true`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No files found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <label htmlFor="file-select" className="font-medium">
          Select PDF:
        </label>
        <select
          id="file-select"
          value={selectedFile?.id || ""}
          onChange={(e) => {
            const file = files.find((f) => f.id === e.target.value);
            setPdfLoading(true);
            setLoadStartTime(Date.now());
            setSelectedFile(file || null);
          }}
          className="border rounded px-3 py-2 min-w-[300px]"
        >
          {files.map((file) => (
            <option key={file.id} value={file.id}>
              {file.fileName} ({formatFileSize(file.size)})
            </option>
          ))}
        </select>
        <button
          onClick={handleDownload}
          disabled={!selectedFile}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          Download
        </button>
      </div>

      {pdfUrl && (
        <>
          {pdfLoading && (
            <div className="flex items-center justify-center h-[800px] border rounded bg-gray-50">
              <div className="text-gray-500">Loading PDF...</div>
            </div>
          )}
          <iframe
            src={pdfUrl}
            className={`w-full h-[800px] border rounded ${pdfLoading ? "hidden" : ""}`}
            title="PDF Viewer"
            onLoad={() => {
              const elapsed = Date.now() - (loadStartTime || 0);
              const remaining = Math.max(0, 300 - elapsed);
              setTimeout(() => setPdfLoading(false), remaining);
            }}
          />
        </>
      )}
    </div>
  );
}
