'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

export function QrGenerator() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const generateQR = async () => {
    if (!text) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
      });
      setQrDataUrl(url);
    } catch (error) {
      alert('Error generating QR code');
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="qr-text">Enter text or URL</Label>
        <Textarea
          id="qr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          rows={4}
          className="mt-2"
        />
      </div>

      <Button onClick={generateQR} disabled={!text} className="w-full" size="lg">
        Generate QR Code
      </Button>

      {qrDataUrl && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={qrDataUrl} alt="QR Code" className="border rounded-lg" />
          </div>
          <Button onClick={downloadQR} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
