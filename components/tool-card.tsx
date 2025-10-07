'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tool } from '@/lib/tools-config';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  index: number;
  onClick: () => void;
}

export function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="h-full bg-card/50 border-border/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm overflow-hidden relative"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/5 transition-all duration-300"></div>

        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-3 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                <Icon className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </div>
          <CardTitle className="text-lg font-bold text-foreground group-hover:text-purple-300 transition-colors duration-300">
            {tool.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
