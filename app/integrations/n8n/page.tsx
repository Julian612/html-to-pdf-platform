'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function N8nIntegrationPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            n8n Integration Guide
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete step-by-step guide to integrate HTML to PDF conversion in your n8n workflows
          </p>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Works with n8n Cloud & Self-Hosted
          </Badge>
        </div>

        <div className="space-y-8">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">1</span>
                Add HTTP Request Node
              </CardTitle>
              <CardDescription className="text-gray-300">
                Start by adding an HTTP Request node to your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>1. Open your n8n workflow editor</p>
                <p>2. Click the <strong className="text-white">+</strong> button to add a new node</p>
                <p>3. Search for <strong className="text-white">HTTP Request</strong></p>
                <p>4. Click to add it to your workflow</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">2</span>
                Configure Basic Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set up the HTTP request method and URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-white">Method</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-green-400 font-mono">POST</p>
                </div>
              </div>

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
                <h4 className="font-semibold mb-2 text-white">Authentication</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-green-400 font-mono">None</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">We'll use headers for authentication</p>
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
                <p>1. Scroll down to <strong className="text-white">Headers</strong> section</p>
                <p>2. Click <strong className="text-white">Add Header</strong></p>
                <p>3. Add the following headers:</p>
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
              <div className="space-y-2 text-gray-300">
                <p>1. Scroll to <strong className="text-white">Body</strong> section</p>
                <p>2. Enable <strong className="text-white">Send Body</strong></p>
                <p>3. Set <strong className="text-white">Body Content Type</strong> to <code className="bg-black/50 px-2 py-1 rounded text-green-400">JSON</code></p>
                <p>4. Choose <strong className="text-white">Specify Body</strong></p>
                <p>5. Add the JSON body:</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Example: Convert HTML</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(`{
  "html": "{{$json.htmlContent}}",
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
  "html": "{{$json.htmlContent}}",
  "format": "A4",
  "landscape": false,
  "printBackground": true
}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Example: Convert URL</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(`{
  "url": "{{$json.websiteUrl}}",
  "format": "Letter",
  "landscape": true
}`, 'JSON body')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "url": "{{$json.websiteUrl}}",
  "format": "Letter",
  "landscape": true
}`}
                </pre>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Pro Tip:</strong> Use n8n expressions like <code className="bg-black/50 px-2 py-1 rounded text-green-400">{'{{$json.field}}'}</code> to dynamically insert data from previous nodes in your workflow.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">5</span>
                Configure Response Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set up how n8n should handle the PDF response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-white">Response Format</h4>
                <div className="bg-black/50 p-3 rounded-lg">
                  <p className="text-green-400 font-mono">File</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">This tells n8n to treat the response as a binary file</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Put Response in Field</h4>
                <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between">
                  <p className="text-green-400 font-mono">data</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('data', 'Field name')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">The PDF will be available as binary data in the "data" field</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">6</span>
                Test Your Workflow
              </CardTitle>
              <CardDescription className="text-gray-300">
                Execute the workflow to verify everything works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>1. Click <strong className="text-white">Execute Node</strong> to test</p>
                <p>2. Check the output - you should see the PDF file in the binary data</p>
                <p>3. You can download the PDF from the node output to verify</p>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-sm text-green-200">
                  <strong>Success!</strong> If you see binary data with content type <code className="bg-black/50 px-2 py-1 rounded text-green-400">application/pdf</code>, your integration is working correctly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Next Steps</CardTitle>
              <CardDescription className="text-gray-300">
                What you can do with the PDF output
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Save to Cloud Storage</p>
                    <p className="text-sm">Connect to Google Drive, Dropbox, AWS S3, etc. to save the PDF</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Send via Email</p>
                    <p className="text-sm">Use Email node to send the PDF as an attachment</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Webhook Response</p>
                    <p className="text-sm">Return the PDF directly via a webhook response</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Store in Database</p>
                    <p className="text-sm">Save to PostgreSQL, MongoDB, or other databases</p>
                  </div>
                </div>
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
                  <p className="text-sm text-gray-300">Check that your X-API-Key header is set correctly with a valid API key</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">500 Server Error</h4>
                  <p className="text-sm text-gray-300">Verify your HTML content is valid or the URL is accessible</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">No Binary Data in Output</h4>
                  <p className="text-sm text-gray-300">Make sure Response Format is set to "File" and not "JSON"</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Timeout Errors</h4>
                  <p className="text-sm text-gray-300">Complex pages or large HTML may take longer. Increase the timeout setting in the HTTP Request node.</p>
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
              <a href="/integrations/make">
                Make.com Guide
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
