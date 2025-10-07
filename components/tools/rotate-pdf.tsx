'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Download, RotateCw, RotateCcw, FlipHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDocument, degrees } from 'pdf-lib';

interface PageRotation {
  pageIndex: number;
  rotation: number;
  selected: boolean;
}

export function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageRotation[]>([]);
  const [processing, setProcessing] = useState(false);
  const [globalRotation, setGlobalRotation] = useState<string>('90');
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loadingThumbs, setLoadingThumbs] = useState(false);

  useEffect(() => {
    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoadingThumbs(true);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        const initialPages: PageRotation[] = Array.from({ length: pageCount }, (_, i) => ({
          pageIndex: i,
          rotation: 0,
          selected: false,
        }));
        setPages(initialPages);

        if (pdfjsLib) {
          await generateThumbnails(arrayBuffer, pageCount);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF file');
      } finally {
        setLoadingThumbs(false);
      }
    }
  };

  const generateThumbnails = async (arrayBuffer: ArrayBuffer, pageCount: number) => {
    if (!pdfjsLib) return;

    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbs: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        thumbs.push(canvas.toDataURL());
      }

      setThumbnails(thumbs);
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setPages(prev => prev.map(p =>
      p.pageIndex === pageIndex ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAllPages = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAllPages = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const rotateSelectedPages = (rotationDegrees: number) => {
    setPages(prev => prev.map(p =>
      p.selected ? { ...p, rotation: (p.rotation + rotationDegrees) % 360 } : p
    ));
  };

  const rotateSinglePage = (pageIndex: number, rotationDegrees: number) => {
    setPages(prev => prev.map(p =>
      p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + rotationDegrees) % 360 } : p
    ));
  };

  const resetRotations = () => {
    setPages(prev => prev.map(p => ({ ...p, rotation: 0 })));
  };

  const applyRotationsAndDownload = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pdfPages = pdf.getPages();

      pages.forEach((pageRotation, index) => {
        if (pageRotation.rotation !== 0) {
          const page = pdfPages[index];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + pageRotation.rotation));
        }
      });

      const pdfBytes = await pdf.save();
      downloadPdf(pdfBytes, 'rotated.pdf');
    } catch (error) {
      alert('Error: Please ensure the file is a valid PDF.');
      console.error('Error rotating PDF:', error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadPdf = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasAnyRotation = pages.some(p => p.rotation !== 0);
  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-rotate"
        />
        <label htmlFor="pdf-rotate" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Click to upload a PDF file
          </p>
          {file && (
            <p className="text-sm font-medium mt-2">
              {file.name} ({pages.length} pages)
            </p>
          )}
        </label>
      </div>

      {file && pages.length > 0 && (
        <>
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Bulk Actions</Label>
              <div className="flex gap-2">
                <Button onClick={selectAllPages} variant="outline" size="sm">
                  Select All
                </Button>
                <Button onClick={deselectAllPages} variant="outline" size="sm">
                  Deselect All
                </Button>
              </div>
            </div>

            {selectedCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Label className="text-sm">
                  Rotate {selectedCount} selected page{selectedCount > 1 ? 's' : ''}:
                </Label>
                <Button
                  onClick={() => rotateSelectedPages(90)}
                  variant="outline"
                  size="sm"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  90° CW
                </Button>
                <Button
                  onClick={() => rotateSelectedPages(180)}
                  variant="outline"
                  size="sm"
                >
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  180°
                </Button>
                <Button
                  onClick={() => rotateSelectedPages(-90)}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  90° CCW
                </Button>
              </div>
            )}

            {hasAnyRotation && (
              <Button onClick={resetRotations} variant="outline" size="sm" className="w-full">
                Reset All Rotations
              </Button>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Pages - Click to select, then rotate individually or use bulk actions
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((page, index) => (
                <div
                  key={page.pageIndex}
                  className={`relative rounded-lg border-2 transition-all ${
                    page.selected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div
                    onClick={() => togglePageSelection(page.pageIndex)}
                    className="cursor-pointer p-2"
                  >
                    {loadingThumbs ? (
                      <div className="aspect-[1/1.4] bg-muted animate-pulse rounded" />
                    ) : thumbnails[index] ? (
                      <img
                        src={thumbnails[index]}
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto rounded"
                        style={{
                          transform: `rotate(${page.rotation}deg)`,
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    ) : (
                      <div className="aspect-[1/1.4] bg-muted rounded flex items-center justify-center">
                        <span className="text-4xl font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    <div className="text-center mt-2 text-sm font-medium">
                      Page {index + 1}
                      {page.rotation !== 0 && (
                        <span className="text-purple-500 ml-1">({page.rotation}°)</span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 space-y-2 border-t border-border">
                    <div className="flex gap-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateSinglePage(page.pageIndex, 90);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <RotateCw className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateSinglePage(page.pageIndex, -90);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={applyRotationsAndDownload}
            disabled={processing || !hasAnyRotation}
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {processing ? 'Processing...' : 'Download Rotated PDF'}
          </Button>
        </>
      )}
    </div>
  );
}
