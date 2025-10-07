'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (error) {
      setOutput('Error encoding text');
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
    } catch (error) {
      setOutput('Error decoding Base64');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4 mt-4">
          <div>
            <Label>Input Text</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode"
              rows={6}
              className="mt-2"
            />
          </div>
          <Button onClick={encode} className="w-full" size="lg">
            Encode to Base64
          </Button>
        </TabsContent>

        <TabsContent value="decode" className="space-y-4 mt-4">
          <div>
            <Label>Base64 Input</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Base64 string to decode"
              rows={6}
              className="mt-2"
            />
          </div>
          <Button onClick={decode} className="w-full" size="lg">
            Decode from Base64
          </Button>
        </TabsContent>
      </Tabs>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Output</Label>
            <Button onClick={copyToClipboard} variant="ghost" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <Textarea value={output} readOnly rows={6} className="font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
