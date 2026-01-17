import React, { useEffect, useRef } from 'react';
import { Building2, Briefcase, Code } from 'lucide-react';
import type { SearchSuggestion } from '../utils/searchUtils';
import { highlightMatch } from '../utils/searchUtils';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  query: string;
  selectedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  query,
  selectedIndex,
  onSelect,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute top-full left-0 right-0 mt-2 bg-surface border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-4"
      >
        <p className="text-sm text-icon text-center">No results found for "{query}"</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'institution':
        return <Building2 size={16} className="text-blue-500" />;
      case 'skill':
        return <Code size={16} className="text-green-500" />;
      case 'company':
        return <Briefcase size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderHighlightedText = (text: string) => {
    const highlighted = highlightMatch(text, query);
    if (!highlighted) return text;

    return (
      <>
        {highlighted.before}
        <span className="font-semibold text-primary">{highlighted.match}</span>
        {highlighted.after}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 bg-surface border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            data-index={index}
            onClick={() => onSelect(suggestion)}
            className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
              index === selectedIndex
                ? 'bg-primary/10 border-l-2 border-primary'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-l-2 border-transparent'
            }`}
          >
            <div className="mt-0.5">{getIcon(suggestion.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text">
                {renderHighlightedText(suggestion.label)}
              </div>
              {suggestion.metadata && (
                <div className="text-xs text-icon mt-0.5">{suggestion.metadata}</div>
              )}
            </div>
            <div className="text-xs text-icon capitalize mt-0.5">{suggestion.type}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
