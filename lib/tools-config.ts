import {
  FileText, FilePlus2, ArrowDownUp, RotateCw, Trash2, FileOutput, Droplet,
  Image, ImagePlus, Workflow, Scissors, Grid3x3, Crop, RefreshCw, Palette,
  Archive, FileArchive, Hash, Key, QrCode, FileCode, type LucideIcon
} from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'pdf' | 'images' | 'files' | 'utilities';
}

export const tools: Tool[] = [
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    description: 'Convert HTML code into PDF documents',
    icon: FileCode,
    category: 'pdf'
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: FilePlus2,
    category: 'pdf'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Split a PDF file into multiple documents',
    icon: Scissors,
    category: 'pdf'
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate pages in your PDF document',
    icon: RotateCw,
    category: 'pdf'
  },
  {
    id: 'extract-pages',
    title: 'Extract Pages',
    description: 'Extract specific pages from PDF',
    icon: FileOutput,
    category: 'pdf'
  },
  {
    id: 'add-watermark',
    title: 'Add Watermark',
    description: 'Add text watermark to PDF',
    icon: Droplet,
    category: 'pdf'
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    description: 'Convert images into a PDF document',
    icon: ImagePlus,
    category: 'pdf'
  },
  {
    id: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce image file size',
    icon: Workflow,
    category: 'images'
  },
  {
    id: 'resize-image',
    title: 'Resize Image',
    description: 'Change image dimensions',
    icon: Grid3x3,
    category: 'images'
  },
  {
    id: 'convert-image',
    title: 'Convert Format',
    description: 'Convert between JPG, PNG, WEBP',
    icon: RefreshCw,
    category: 'images'
  },
  {
    id: 'rotate-image',
    title: 'Rotate/Flip Image',
    description: 'Rotate or flip images',
    icon: RotateCw,
    category: 'images'
  },
  {
    id: 'apply-filters',
    title: 'Apply Filters',
    description: 'Adjust brightness, contrast, grayscale',
    icon: Palette,
    category: 'images'
  },
  {
    id: 'zip-files',
    title: 'Create ZIP',
    description: 'Compress files into ZIP archive',
    icon: Archive,
    category: 'files'
  },
  {
    id: 'unzip-files',
    title: 'Extract ZIP',
    description: 'Extract files from ZIP archive',
    icon: FileArchive,
    category: 'files'
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure random passwords',
    icon: Key,
    category: 'utilities'
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create QR codes from text',
    icon: QrCode,
    category: 'utilities'
  },
  {
    id: 'base64-encode',
    title: 'Base64 Encode/Decode',
    description: 'Encode or decode Base64 strings',
    icon: Hash,
    category: 'utilities'
  }
];

export const categories = [
  { id: 'pdf', label: 'PDF Tools', icon: FileText },
  { id: 'images', label: 'Image Tools', icon: Image },
  { id: 'files', label: 'File Tools', icon: Archive },
  { id: 'utilities', label: 'Utilities', icon: Workflow }
];
