'use client';

import { useState } from 'react';
import { ToolCard } from '@/components/tool-card';
import { ToolDialog } from '@/components/tool-dialog';
import { NavigationMenu } from '@/components/navigation-menu';
import { tools, Tool } from '@/lib/tools-config';
import { motion } from 'framer-motion';
import { FileText, Mail, Globe, Sparkles, Code, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 opacity-20 blur-xl"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  PDFTools
                </h1>
                <p className="text-xs text-muted-foreground">Premium Edition</p>
              </div>
            </div>
            <NavigationMenu onToolSelect={handleToolClick} />
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none"></div>

        <section className="relative container mx-auto px-4 lg:px-8 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">100% Free & Secure</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                Simple & Reliable
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                PDF Tools
              </span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your favorite PDF tools in one place. All tools are 100% free and easy to use.
              Process files directly in your browser - no uploads required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
                onClick={() => handleToolClick(tool)}
              />
            ))}
          </motion.div>
        </section>

        <section className="relative py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 via-fuchsia-600/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Code className="w-8 h-8 text-purple-400" />
                  <h3 className="text-3xl md:text-4xl font-bold text-white">Powerful API Access</h3>
                </div>

                <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-8">
                  Automate PDF generation with our professional HTML to PDF API. Perfect for n8n, Make.com, and custom integrations.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <Zap className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Lightning Fast</h4>
                    <p className="text-sm text-gray-400">Convert HTML to PDF in 2-5 seconds with full CSS support</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <Globe className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">URL Conversion</h4>
                    <p className="text-sm text-gray-400">Convert any webpage to PDF with a single API call</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <Code className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Easy Integration</h4>
                    <p className="text-sm text-gray-400">Works with n8n, Make.com, Zapier, and any HTTP client</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/api-docs"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-fuchsia-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                  >
                    View API Documentation
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="/api-tester"
                    className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                  >
                    Try API Tester
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="relative py-24 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  About PDFTools
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">Our Mission</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    We provide powerful, easy-to-use PDF tools that work entirely in your browser.
                    No file uploads, no registration required - just pure functionality at your fingertips.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">Privacy First</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    All processing happens locally in your browser. Your files never leave your device,
                    ensuring complete privacy and security for your sensitive documents.
                  </p>
                </div>
              </div>

              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h4 className="text-2xl font-bold mb-2 text-foreground">Need Help?</h4>
                    <p className="text-muted-foreground">
                      Have questions or feedback? We'd love to hear from you. Reach out to our support team anytime.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-border/50 py-12 bg-card/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-muted-foreground">
                  © 2025 PDFTools. All rights reserved.
                </span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#about" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  About Us
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <ToolDialog tool={selectedTool} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
