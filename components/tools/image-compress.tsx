'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ImageCompressToolProps {
  mode: 'compress-image' | 'resize-image' | 'convert-image' | 'rotate-image' | 'apply-filters' | 'crop-image';
}

export function ImageCompressTool({ mode }: ImageCompressToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [processedPreview, setProcessedPreview] = useState('');
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState('png');
  const [processing, setProcessing] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [grayscale, setGrayscale] = useState([0]);
  const [blur, setBlur] = useState([0]);

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (preview && (mode === 'rotate-image' || mode === 'apply-filters')) {
      applyLivePreview();
    }
  }, [rotation, flipH, flipV, brightness, contrast, saturation, grayscale, blur, mode]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);

        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width.toString());
          setHeight(img.height.toString());

          if (mode === 'rotate-image' || mode === 'apply-filters') {
            applyLivePreview(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const applyLivePreview = async (imageData?: string) => {
    const src = imageData || preview;
    if (!src) return;

    try {
      const img = new Image();
      img.src = src;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (mode === 'rotate-image') {
        const rad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        canvas.width = img.height * sin + img.width * cos;
        canvas.height = img.height * cos + img.width * sin;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (mode === 'apply-filters') {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) grayscale(${grayscale[0]}%) blur(${blur[0]}px)`;
        ctx.drawImage(img, 0, 0);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      setProcessedPreview(canvas.toDataURL());
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const processImage = async () => {
    if (!file || !preview) return;
    setProcessing(true);

    try {
      const img = new Image();
      img.src = preview;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (mode === 'rotate-image') {
        const rad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        canvas.width = img.height * sin + img.width * cos;
        canvas.height = img.height * cos + img.width * sin;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (mode === 'apply-filters') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) grayscale(${grayscale[0]}%) blur(${blur[0]}px)`;
        ctx.drawImage(img, 0, 0);
      } else if (mode === 'resize-image') {
        canvas.width = parseInt(width) || img.width;
        canvas.height = parseInt(height) || img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `processed-${file.name.split('.')[0]}.${format}`;
          a.click();
          URL.revokeObjectURL(url);
          setProcessing(false);
        },
        `image/${format}`,
        quality[0] / 100
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessing(false);
    }
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleFlipH = () => {
    setFlipH(!flipH);
  };

  const handleFlipV = () => {
    setFlipV(!flipV);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (maintainAspect && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(parseInt(value) * aspectRatio).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (maintainAspect && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(parseInt(value) * aspectRatio).toString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Click to upload an image
          </p>
          {file && <p className="text-sm font-medium mt-2">{file.name}</p>}
        </label>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <img
                src={processedPreview || preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border mx-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {mode === 'compress-image' && (
            <div>
              <Label>Quality: {quality[0]}%</Label>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={10}
                className="mt-2"
              />
            </div>
          )}

          {mode === 'resize-image' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintain-aspect"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="maintain-aspect" className="text-sm">Maintain aspect ratio</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                    className="mt-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Original: {originalDimensions.width} × {originalDimensions.height}px
              </p>
            </div>
          )}

          {mode === 'rotate-image' && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Rotation: {rotation}°</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => handleRotate(90)} variant="outline" size="sm">
                    Rotate 90° Right
                  </Button>
                  <Button onClick={() => handleRotate(-90)} variant="outline" size="sm">
                    Rotate 90° Left
                  </Button>
                  <Button onClick={() => handleRotate(180)} variant="outline" size="sm">
                    Rotate 180°
                  </Button>
                  <Button onClick={() => setRotation(0)} variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Flip</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFlipH}
                    variant={flipH ? "default" : "outline"}
                    size="sm"
                  >
                    Flip Horizontal
                  </Button>
                  <Button
                    onClick={handleFlipV}
                    variant={flipV ? "default" : "outline"}
                    size="sm"
                  >
                    Flip Vertical
                  </Button>
                </div>
              </div>

              <div>
                <Label>Custom Rotation</Label>
                <Slider
                  value={[rotation]}
                  onValueChange={(val) => setRotation(val[0])}
                  min={0}
                  max={360}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {mode === 'apply-filters' && (
            <div className="space-y-4">
              <div>
                <Label>Brightness: {brightness[0]}%</Label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={0}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Contrast: {contrast[0]}%</Label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={0}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Saturation: {saturation[0]}%</Label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  min={0}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Grayscale: {grayscale[0]}%</Label>
                <Slider
                  value={grayscale}
                  onValueChange={setGrayscale}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Blur: {blur[0]}px</Label>
                <Slider
                  value={blur}
                  onValueChange={setBlur}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => {
                  setBrightness([100]);
                  setContrast([100]);
                  setSaturation([100]);
                  setGrayscale([0]);
                  setBlur([0]);
                  setProcessedPreview('');
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {mode === 'convert-image' && (
            <div>
              <Label>Output Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={processImage} disabled={processing} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            {processing ? 'Processing...' : 'Download Processed Image'}
          </Button>
        </div>
      )}
    </div>
  );
}
