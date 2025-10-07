'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Download, Loader as Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ApiTesterPage() {
  const [apiKey, setApiKey] = useState('');
  const [inputType, setInputType] = useState<'html' | 'url'>('html');
  const [htmlContent, setHtmlContent] = useState('<h1>Hello World</h1>\n<p>This is a test PDF document.</p>\n<p>You can add any HTML content here.</p>');
  const [pageUrl, setPageUrl] = useState('https://example.com');
  const [format, setFormat] = useState('A4');
  const [landscape, setLandscape] = useState(false);
  const [printBackground, setPrintBackground] = useState(true);
  const [scale, setScale] = useState('1');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setPdfUrl(null);

    try {
      const requestBody: any = {
        format,
        landscape,
        printBackground,
        scale: parseFloat(scale),
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      };

      if (inputType === 'html') {
        requestBody.html = htmlContent;
      } else {
        requestBody.url = pageUrl;
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert to PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'test-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            API Tester
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Test the HTML to PDF API in your browser
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Authentication</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your API key to test the endpoint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="apiKey" className="text-white">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="your-api-key-here"
                  className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Input</CardTitle>
                <CardDescription className="text-gray-300">
                  Choose input type and provide content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="inputType" className="text-white">Input Type</Label>
                  <Select value={inputType} onValueChange={(value: 'html' | 'url') => setInputType(value)}>
                    <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML Content</SelectItem>
                      <SelectItem value="url">Web URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputType === 'html' ? (
                  <div>
                    <Label htmlFor="htmlContent" className="text-white">HTML Content</Label>
                    <Textarea
                      id="htmlContent"
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      rows={8}
                      className="mt-2 bg-white/5 border-white/20 text-white font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="url" className="text-white">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={pageUrl}
                      onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="mt-2 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Options</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure PDF generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="format" className="text-white">Page Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="A5">A5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scale" className="text-white">Scale (0.1 - 2.0)</Label>
                  <Input
                    id="scale"
                    type="number"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="mt-2 bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="landscape" className="text-white">Landscape Orientation</Label>
                  <Switch
                    id="landscape"
                    checked={landscape}
                    onCheckedChange={setLandscape}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="printBackground" className="text-white">Print Background</Label>
                  <Switch
                    id="printBackground"
                    checked={printBackground}
                    onCheckedChange={setPrintBackground}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleTest}
              disabled={loading || !apiKey}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert to PDF'
              )}
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Request Preview</CardTitle>
                <CardDescription className="text-gray-300">
                  The actual API request that will be sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/50 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`POST /api/convert
Headers:
  Content-Type: application/json
  X-API-Key: ${apiKey ? '••••••••' : 'not-set'}

Body:
${JSON.stringify({
  [inputType === 'html' ? 'html' : 'url']: inputType === 'html' ? htmlContent.substring(0, 50) + '...' : pageUrl,
  format,
  landscape,
  printBackground,
  scale: parseFloat(scale),
  margin: {
    top: '1cm',
    right: '1cm',
    bottom: '1cm',
    left: '1cm'
  }
}, null, 2)}`}
                </pre>
              </CardContent>
            </Card>

            {error && (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && pdfUrl && (
              <Alert className="bg-green-500/20 border-green-500/50">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  PDF generated successfully!
                </AlertDescription>
              </Alert>
            )}

            {pdfUrl && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Result</CardTitle>
                  <CardDescription className="text-gray-300">
                    Your PDF is ready to download
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-semibold mb-2">PDF Generated</p>
                    <p className="text-gray-400 text-sm mb-4">test-document.pdf</p>
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-300">
                <p className="text-sm">
                  View the complete <a href="/api-docs" className="text-purple-400 hover:text-purple-300 underline">API Documentation</a>
                </p>
                <p className="text-sm">
                  Check out integration guides for <a href="/integrations/n8n" className="text-purple-400 hover:text-purple-300 underline">n8n</a> and <a href="/integrations/make" className="text-purple-400 hover:text-purple-300 underline">Make.com</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
