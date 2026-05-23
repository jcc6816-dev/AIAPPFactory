import React from 'react';

interface TabBarProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ categories, selected, onSelect }) => {
  return (
    <nav className="flex space-x-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selected === cat ? 'bg-white text-slate-900' : 'bg-transparent text-white hover:bg-white/10'}`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
