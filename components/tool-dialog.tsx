'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tool } from '@/lib/tools-config';
import { HtmlToPdfTool } from './tools/html-to-pdf';
import { MergePdfTool } from './tools/merge-pdf';
import { SplitPdfTool } from './tools/split-pdf';
import { RotatePdfTool } from './tools/rotate-pdf';
import { ExtractPagesTool } from './tools/extract-pages';
import { WatermarkTool } from './tools/watermark';
import { ImagesToPdfTool } from './tools/images-to-pdf';
import { PasswordGenerator } from './tools/password-generator';
import { QrGenerator } from './tools/qr-generator';
import { Base64Tool } from './tools/base64-tool';
import { ImageCompressTool } from './tools/image-compress';
import { ZipTool } from './tools/zip-tool';

interface ToolDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolDialog({ tool, open, onOpenChange }: ToolDialogProps) {
  if (!tool) return null;

  const renderToolContent = () => {
    switch (tool.id) {
      case 'html-to-pdf':
        return <HtmlToPdfTool />;
      case 'merge-pdf':
        return <MergePdfTool />;
      case 'split-pdf':
        return <SplitPdfTool />;
      case 'rotate-pdf':
        return <RotatePdfTool />;
      case 'extract-pages':
        return <ExtractPagesTool />;
      case 'add-watermark':
        return <WatermarkTool />;
      case 'images-to-pdf':
        return <ImagesToPdfTool />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'base64-encode':
        return <Base64Tool />;
      case 'compress-image':
      case 'resize-image':
      case 'convert-image':
      case 'rotate-image':
      case 'apply-filters':
        return <ImageCompressTool mode={tool.id} />;
      case 'zip-files':
      case 'unzip-files':
        return <ZipTool mode={tool.id} />;
      default:
        return (
          <div className="py-8 text-center text-muted-foreground">
            <p>This tool is under development.</p>
            <p className="text-sm mt-2">Coming soon!</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <tool.icon className="h-6 w-6 text-primary" />
            {tool.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderToolContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
