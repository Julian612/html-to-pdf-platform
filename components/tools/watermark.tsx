'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';

export function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const addWatermark = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdf.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * 10),
          y: height / 2,
          size: 50,
          color: rgb(0.75, 0.75, 0.75),
          opacity: 0.3,
        });
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'watermarked.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setFile(null);
    } catch (error) {
      alert('Error: Please ensure the file is a valid PDF.');
      console.error('Error adding watermark:', error);
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
          id="pdf-watermark"
        />
        <label htmlFor="pdf-watermark" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Click to upload a PDF file
          </p>
          {file && <p className="text-sm font-medium mt-2">{file.name}</p>}
        </label>
      </div>

      {file && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="watermark">Watermark Text</Label>
            <Input
              id="watermark"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
            />
          </div>

          <Button onClick={addWatermark} disabled={processing} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            {processing ? 'Adding Watermark...' : 'Add Watermark'}
          </Button>
        </div>
      )}
    </div>
  );
}
