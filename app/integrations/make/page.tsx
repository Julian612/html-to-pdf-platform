'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MakeIntegrationPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Make.com Integration Guide
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete step-by-step guide to integrate HTML to PDF conversion in your Make scenarios
          </p>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Works with All Make.com Plans
          </Badge>
        </div>

        <div className="space-y-8">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">1</span>
                Add HTTP Module
              </CardTitle>
              <CardDescription className="text-gray-300">
                Start by adding an HTTP module to your scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>1. Open your Make.com scenario editor</p>
                <p>2. Click the <strong className="text-white">+</strong> button to add a new module</p>
                <p>3. Search for <strong className="text-white">HTTP</strong></p>
                <p>4. Select <strong className="text-white">Make a request</strong></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">2</span>
                Configure Request Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set up the basic HTTP request parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-white">URL</h4>
                <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                  <p className="text-green-400 font-mono text-sm">https://your-domain.com/api/convert</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('https://your-domain.com/api/convert', 'URL')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Replace with your actual domain</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Method</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-green-400 font-mono">POST</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Request Content Type</h4>
                <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                  <p className="text-green-400 font-mono">application/json</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('application/json', 'Content Type')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Parse Response</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-red-400 font-mono">No</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">Important: Set to "No" because the response is a PDF file, not JSON</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">3</span>
                Add Headers
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure authentication and content type headers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>1. Scroll down to the <strong className="text-white">Headers</strong> section</p>
                <p>2. Click <strong className="text-white">Add item</strong> for each header</p>
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Header 1: API Key</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Name</p>
                      <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                        <p className="text-green-400 font-mono text-sm">X-API-Key</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard('X-API-Key', 'Header name')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Value</p>
                      <div className="bg-black/50 p-3 rounded-lg">
                        <p className="text-yellow-400 font-mono text-sm">your-api-key-here</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Header 2: Content Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Name</p>
                      <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                        <p className="text-green-400 font-mono text-sm">Content-Type</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard('Content-Type', 'Header name')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Value</p>
                      <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                        <p className="text-green-400 font-mono text-sm">application/json</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard('application/json', 'Header value')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">4</span>
                Configure Request Body
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set up the JSON body with your HTML content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-white">Body Type</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-green-400 font-mono">Raw</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Example: Convert HTML</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(`{
  "html": "{{1.htmlContent}}",
  "format": "A4",
  "landscape": false,
  "printBackground": true
}`, 'JSON body')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "html": "{{1.htmlContent}}",
  "format": "A4",
  "landscape": false,
  "printBackground": true
}`}
                </pre>
                <p className="text-sm text-gray-400 mt-2">Use Make variables like {'{{1.fieldName}}'} to reference data from previous modules</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Example: Convert URL</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(`{
  "url": "{{1.websiteUrl}}",
  "format": "Letter",
  "landscape": true,
  "margin": {
    "top": "2cm",
    "bottom": "2cm",
    "left": "1.5cm",
    "right": "1.5cm"
  }
}`, 'JSON body')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "url": "{{1.websiteUrl}}",
  "format": "Letter",
  "landscape": true,
  "margin": {
    "top": "2cm",
    "bottom": "2cm",
    "left": "1.5cm",
    "right": "1.5cm"
  }
}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Example: Static HTML</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(`{
  "html": "<h1>Invoice #12345</h1><p>Amount: $250</p>",
  "format": "A4",
  "displayHeaderFooter": true,
  "footerTemplate": "<div style='font-size:10px; text-align:center; width:100%;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>"
}`, 'JSON body')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "html": "<h1>Invoice #12345</h1><p>Amount: $250</p>",
  "format": "A4",
  "displayHeaderFooter": true,
  "footerTemplate": "<div style='font-size:10px; text-align:center; width:100%;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>"
}`}
                </pre>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Pro Tip:</strong> You can click the fields in the Request content field to insert variables from previous modules dynamically.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">5</span>
                Test Your Module
              </CardTitle>
              <CardDescription className="text-gray-300">
                Run the module to verify the PDF generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>1. Click <strong className="text-white">OK</strong> to save the module settings</p>
                <p>2. Click <strong className="text-white">Run once</strong> to test your scenario</p>
                <p>3. Check the output - you should see the PDF data in the response</p>
                <p>4. The <code className="bg-black/50 px-2 py-1 rounded text-green-400">data</code> field will contain the base64-encoded PDF</p>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-sm text-green-200">
                  <strong>Success!</strong> If the module runs without errors and you see binary/base64 data in the output, your integration is working correctly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">6</span>
                Save or Send the PDF
              </CardTitle>
              <CardDescription className="text-gray-300">
                Add another module to handle the generated PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-gray-300">
                <p>After the HTTP module, add one of these modules to handle the PDF:</p>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Google Drive - Upload a File</p>
                    <p className="text-sm">Save the PDF to Google Drive automatically</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Dropbox - Upload a File</p>
                    <p className="text-sm">Store the PDF in Dropbox</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Email - Send an Email</p>
                    <p className="text-sm">Attach the PDF to an email and send it</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">AWS S3 - Upload a File</p>
                    <p className="text-sm">Store the PDF in Amazon S3 bucket</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Webhook Response</p>
                    <p className="text-sm">Return the PDF directly as a webhook response</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-200">
                  <strong>Mapping the PDF:</strong> When configuring the next module, map the <code className="bg-black/50 px-2 py-1 rounded text-green-400">data</code> field from the HTTP module output to the file/attachment field.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Advanced Configuration</CardTitle>
              <CardDescription className="text-gray-300">
                Optional parameters for more control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-white">All Available Parameters</h4>
                <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "html": "<your-html>",
  "format": "A4",
  "landscape": false,
  "margin": {
    "top": "1cm",
    "right": "1cm",
    "bottom": "1cm",
    "left": "1cm"
  },
  "printBackground": true,
  "scale": 1,
  "displayHeaderFooter": false,
  "headerTemplate": "<div>Header content</div>",
  "footerTemplate": "<div>Footer content</div>",
  "preferCSSPageSize": false
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Parameter Descriptions</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                  <li><strong className="text-white">format:</strong> A4, Letter, Legal, A3, A5, Tabloid</li>
                  <li><strong className="text-white">landscape:</strong> true/false for orientation</li>
                  <li><strong className="text-white">margin:</strong> Object with top/right/bottom/left values</li>
                  <li><strong className="text-white">printBackground:</strong> Include CSS backgrounds and colors</li>
                  <li><strong className="text-white">scale:</strong> Number from 0.1 to 2 (default: 1)</li>
                  <li><strong className="text-white">displayHeaderFooter:</strong> Show header/footer templates</li>
                  <li><strong className="text-white">headerTemplate:</strong> HTML for page header</li>
                  <li><strong className="text-white">footerTemplate:</strong> HTML for page footer</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-white mb-2">401 Unauthorized Error</h4>
                  <p className="text-sm text-gray-300">Double-check that your X-API-Key header is set correctly with your valid API key</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Invalid JSON Error</h4>
                  <p className="text-sm text-gray-300">Make sure your request body is valid JSON. Use the JSON validator in Make or an external tool.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">500 Server Error</h4>
                  <p className="text-sm text-gray-300">Check that your HTML is valid or the URL you're trying to convert is accessible</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Empty or Corrupted PDF</h4>
                  <p className="text-sm text-gray-300">Ensure "Parse response" is set to "No" since the response is binary data, not JSON</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Timeout Errors</h4>
                  <p className="text-sm text-gray-300">Complex pages may take longer to render. Increase the timeout in the HTTP module settings (Advanced settings)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <a href="/api-docs">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full API Docs
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <a href="/integrations/n8n">
                n8n Guide
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
