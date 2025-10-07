'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FileDown, Loader as Loader2, Upload, CircleAlert as AlertCircle, Info } from 'lucide-react';

export function HtmlToPdfTool() {
  const [html, setHtml] = useState('');
  const [filename, setFilename] = useState('document.pdf');
  const [format, setFormat] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageSizes = {
    A4: { width: 595, height: 842 },
    Letter: { width: 612, height: 792 },
    Legal: { width: 612, height: 1008 }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      alert('Please upload an HTML file (.html or .htm)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtml(content);
      const nameWithoutExt = file.name.replace(/\.(html|htm)$/, '');
      setFilename(`${nameWithoutExt}.pdf`);
    };
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    if (!html.trim()) {
      alert('Please enter HTML content');
      return;
    }

    setIsProcessing(true);

    try {
      const pageSize = pageSizes[format];
      const width = orientation === 'portrait' ? pageSize.width : pageSize.height;
      const height = orientation === 'portrait' ? pageSize.height : pageSize.width;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([width, height]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const strippedText = html
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const margin = 50;
      const maxWidth = width - 2 * margin;
      const fontSize = 12;
      const lineHeight = fontSize * 1.5;

      let yPosition = height - margin;
      const words = strippedText.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth && currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0)
          });
          yPosition -= lineHeight;
          currentLine = word;

          if (yPosition < margin) {
            const newPage = pdfDoc.addPage([width, height]);
            yPosition = height - margin;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check your HTML content.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-purple-500/50 bg-purple-500/10">
        <Info className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-sm">
          This browser tool converts HTML to text-based PDF. For full HTML rendering with CSS support, use our{' '}
          <a href="/api-tester" className="font-semibold underline hover:text-purple-300">
            API Tester
          </a>{' '}
          or check the{' '}
          <a href="/api-docs" className="font-semibold underline hover:text-purple-300">
            API Documentation
          </a>.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="html-input">HTML Content</Label>
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload HTML File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <Textarea
          id="html-input"
          placeholder="Paste your HTML content here or upload an HTML file..."
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Enter HTML code to convert. Note: HTML tags and CSS will be stripped, only text content will appear in the PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="document.pdf"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Page Format</Label>
          <Select value={format} onValueChange={(value: any) => setFormat(value)}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation">Orientation</Label>
          <Select value={orientation} onValueChange={(value: any) => setOrientation(value)}>
            <SelectTrigger id="orientation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleConvert}
        disabled={isProcessing || !html.trim()}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 mr-2" />
            Convert to PDF
          </>
        )}
      </Button>
    </div>
  );
}
