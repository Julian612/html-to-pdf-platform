'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState('1-3, 4-6');
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

  const splitPdf = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const rangeArray = ranges.split(',').map(r => r.trim());

      for (let i = 0; i < rangeArray.length; i++) {
        const range = rangeArray[i];
        const [start, end] = range.includes('-')
          ? range.split('-').map(n => parseInt(n.trim()) - 1)
          : [parseInt(range) - 1, parseInt(range) - 1];

        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(
          sourcePdf,
          Array.from({ length: end - start + 1 }, (_, i) => start + i)
        );
        pages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `split_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setFile(null);
    } catch (error) {
      alert('Error: Please ensure the file is a valid PDF and page ranges are correct.');
      console.error('Error splitting PDF:', error);
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
          id="pdf-split"
        />
        <label htmlFor="pdf-split" className="cursor-pointer">
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
            <Label htmlFor="ranges">Page Ranges (e.g., 1-3, 4-6)</Label>
            <Input
              id="ranges"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="1-3, 4-6"
            />
          </div>

          <Button onClick={splitPdf} disabled={processing} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            {processing ? 'Splitting...' : 'Split PDF'}
          </Button>
        </div>
      )}
    </div>
  );
}
