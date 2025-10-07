'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, X } from 'lucide-react';
import JSZip from 'jszip';

interface ZipToolProps {
  mode: 'zip-files' | 'unzip-files';
}

export function ZipTool({ mode }: ZipToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const createZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const zip = new JSZip();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archive.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP:', error);
    } finally {
      setProcessing(false);
    }
  };

  const extractZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      for (const [filename, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const blob = await zipEntry.async('blob');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Error extracting ZIP:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          multiple={mode === 'zip-files'}
          accept={mode === 'unzip-files' ? '.zip' : '*'}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {mode === 'zip-files'
              ? 'Click to upload files to compress'
              : 'Click to upload a ZIP file'}
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={mode === 'zip-files' ? createZip : extractZip}
        disabled={files.length === 0 || processing}
        className="w-full"
        size="lg"
      >
        <Download className="h-4 w-4 mr-2" />
        {processing
          ? 'Processing...'
          : mode === 'zip-files'
          ? 'Create ZIP'
          : 'Extract ZIP'}
      </Button>
    </div>
  );
}
