'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export function ExtractPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState('1, 3, 5');
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    }
  };

  const extractPages = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const pageNumbers = pages.split(',').map(p => parseInt(p.trim()) - 1);

      const copiedPages = await newPdf.copyPages(sourcePdf, pageNumbers);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setFile(null);
    } catch (error) {
      alert('Error: Please ensure the file is a valid PDF and page numbers are correct.');
      console.error('Error extracting pages:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-extract"
        />
        <label htmlFor="pdf-extract" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Click to upload a PDF file
          </p>
          {file && (
            <p className="text-sm font-medium mt-2">
              {file.name} ({pageCount} pages)
            </p>
          )}
        </label>
      </div>

      {file && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pages">Pages to Extract (comma-separated)</Label>
            <Input
              id="pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="1, 3, 5"
            />
          </div>

          <Button onClick={extractPages} disabled={processing} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            {processing ? 'Extracting...' : 'Extract Pages'}
          </Button>
        </div>
      )}
    </div>
  );
}
