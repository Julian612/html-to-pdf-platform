'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, Zap, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            HTML to PDF API
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Convert any HTML or webpage to PDF with a simple API call
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-3 h-3 mr-1" />
              Fast Conversion
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              High Quality
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Code className="w-3 h-3 mr-1" />
              Easy Integration
            </Badge>
          </div>
        </div>

        <Card className="mb-8 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              Quick Start
            </CardTitle>
            <CardDescription className="text-gray-300">
              Get started with the API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Endpoint</h3>
              <code className="block bg-black/50 text-green-400 p-4 rounded-lg">
                POST https://your-domain.com/api/convert
              </code>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Authentication</h3>
              <p className="text-gray-300 mb-2">
                Include your API key in the request header:
              </p>
              <code className="block bg-black/50 text-green-400 p-4 rounded-lg">
                X-API-Key: your-api-key-here
              </code>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Request Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-white">Required (one of):</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">html</code> - HTML content as a string
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">url</code> - URL of webpage to convert
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-white">Optional Parameters:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">format</code> - Page format (A4, Letter, Legal, A3, A5, etc.) - Default: A4
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">landscape</code> - Boolean for landscape orientation - Default: false
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">margin</code> - Object with top, right, bottom, left margins - Default: 1cm each
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">printBackground</code> - Include background graphics - Default: true
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">scale</code> - Scale factor (0.1 to 2) - Default: 1
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">displayHeaderFooter</code> - Show header and footer - Default: false
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">headerTemplate</code> - HTML for header (requires displayHeaderFooter: true)
                  </li>
                  <li>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400">footerTemplate</code> - HTML for footer (requires displayHeaderFooter: true)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Code Examples</CardTitle>
            <CardDescription className="text-gray-300">
              Integration examples for popular languages and platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
                <TabsTrigger value="n8n">n8n</TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Convert HTML to PDF</h4>
                  <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://your-domain.com/api/convert \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{
    "html": "<h1>Hello World</h1><p>This is a PDF</p>",
    "format": "A4",
    "landscape": false
  }' \\
  --output document.pdf`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Convert URL to PDF</h4>
                  <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://your-domain.com/api/convert \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{
    "url": "https://example.com",
    "format": "Letter",
    "margin": {
      "top": "2cm",
      "bottom": "2cm",
      "left": "1cm",
      "right": "1cm"
    }
  }' \\
  --output webpage.pdf`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="javascript" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Node.js / JavaScript</h4>
                  <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const fs = require('fs');

async function convertToPdf() {
  const response = await fetch('https://your-domain.com/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-api-key-here'
    },
    body: JSON.stringify({
      html: '<h1>Hello from JavaScript!</h1>',
      format: 'A4',
      landscape: false,
      printBackground: true
    })
  });

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    fs.writeFileSync('output.pdf', Buffer.from(buffer));
    console.log('PDF saved successfully!');
  } else {
    const error = await response.json();
    console.error('Error:', error);
  }
}

convertToPdf();`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="python" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Python with Requests</h4>
                  <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import requests

def convert_to_pdf():
    url = 'https://your-domain.com/api/convert'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key-here'
    }

    data = {
        'html': '<h1>Hello from Python!</h1>',
        'format': 'A4',
        'landscape': False,
        'printBackground': True
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        with open('output.pdf', 'wb') as f:
            f.write(response.content)
        print('PDF saved successfully!')
    else:
        print('Error:', response.json())

convert_to_pdf()`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="php" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">PHP with cURL</h4>
                  <pre className="bg-black/70 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<?php

function convertToPdf() {
    $url = 'https://your-domain.com/api/convert';
    $apiKey = 'your-api-key-here';

    $data = [
        'html' => '<h1>Hello from PHP!</h1>',
        'format' => 'A4',
        'landscape' => false,
        'printBackground' => true
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        file_put_contents('output.pdf', $response);
        echo 'PDF saved successfully!';
    } else {
        echo 'Error: ' . $response;
    }
}

convertToPdf();

?>`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="n8n" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">n8n HTTP Request Node Setup</h4>
                  <div className="bg-black/70 text-gray-300 p-4 rounded-lg space-y-3">
                    <p className="text-white font-semibold">Configuration:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Method:</strong> POST</li>
                      <li><strong>URL:</strong> https://your-domain.com/api/convert</li>
                      <li><strong>Authentication:</strong> None (use headers)</li>
                      <li><strong>Send Body:</strong> Yes</li>
                      <li><strong>Body Content Type:</strong> JSON</li>
                    </ul>

                    <p className="text-white font-semibold mt-4">Headers:</p>
                    <pre className="bg-black/50 text-green-400 p-3 rounded text-sm">
{`{
  "X-API-Key": "your-api-key-here",
  "Content-Type": "application/json"
}`}
                    </pre>

                    <p className="text-white font-semibold mt-4">Body:</p>
                    <pre className="bg-black/50 text-green-400 p-3 rounded text-sm">
{`{
  "html": "{{$json.htmlContent}}",
  "format": "A4",
  "landscape": false
}`}
                    </pre>

                    <p className="text-white font-semibold mt-4">Response Format:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Response Format:</strong> File</li>
                      <li><strong>Binary Property:</strong> data</li>
                    </ul>

                    <p className="mt-4 text-yellow-400">
                      See the <a href="/integrations/n8n" className="underline hover:text-yellow-300">detailed n8n integration guide</a> for step-by-step instructions.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Error Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-white">401 Unauthorized</h4>
              <pre className="bg-black/70 text-red-400 p-4 rounded-lg text-sm">
{`{
  "error": "Invalid or missing API key. Include X-API-Key header with your API key."
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white">400 Bad Request</h4>
              <pre className="bg-black/70 text-red-400 p-4 rounded-lg text-sm">
{`{
  "error": "Either 'html' or 'url' parameter is required"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white">500 Server Error</h4>
              <pre className="bg-black/70 text-red-400 p-4 rounded-lg text-sm">
{`{
  "error": "Failed to convert HTML to PDF",
  "message": "Detailed error message"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Integration Guides</CardTitle>
            <CardDescription className="text-gray-300">
              Detailed setup instructions for popular automation platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="/integrations/n8n"
                className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">n8n Integration Guide</h4>
                <p className="text-sm text-gray-300">
                  Complete step-by-step setup for n8n workflow automation
                </p>
              </a>

              <a
                href="/integrations/make"
                className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">Make.com Integration Guide</h4>
                <p className="text-sm text-gray-300">
                  Complete step-by-step setup for Make.com scenarios
                </p>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <a
            href="/api-tester"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Try the Interactive API Tester
          </a>
        </div>
      </div>
    </div>
  );
}
