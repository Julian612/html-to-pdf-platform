'use client';

import { useState } from 'react';
import { ChevronDown, Chrome as Home } from 'lucide-react';
import { tools, categories } from '@/lib/tools-config';
import { Tool } from '@/lib/tools-config';

interface NavigationMenuProps {
  onToolSelect: (tool: Tool) => void;
}

export function NavigationMenu({ onToolSelect }: NavigationMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const handleToolClick = (tool: Tool) => {
    onToolSelect(tool);
    setOpenDropdown(null);
  };

  const getToolsByCategory = (categoryId: string) => {
    return tools.filter(tool => tool.category === categoryId);
  };

  return (
    <nav className="hidden lg:flex items-center gap-8">
      <a
        href="#"
        className="text-sm font-medium text-foreground hover:text-purple-400 transition-colors flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Home
      </a>

      {categories.map((category, index) => {
        const categoryTools = getToolsByCategory(category.id);
        const isOpen = openDropdown === category.id;
        const isLastTwoItems = index >= categories.length - 2;

        return (
          <div key={category.id} className="relative group">
            <button
              onClick={() => toggleDropdown(category.id)}
              onMouseEnter={() => setOpenDropdown(category.id)}
              className="text-sm font-medium text-foreground hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              {category.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                className={`absolute top-full mt-2 w-64 bg-card border border-border/50 rounded-xl shadow-2xl shadow-purple-500/10 overflow-hidden z-50 ${isLastTwoItems ? 'right-0' : 'left-0'}`}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="p-2">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-purple-500/10 transition-colors text-left group/item"
                      >
                        <div className="mt-0.5">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground group-hover/item:text-purple-400 transition-colors">
                            {tool.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {tool.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
