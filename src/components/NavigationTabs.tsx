import React from 'react';
import { BookOpen, Mic, HelpCircle, Award, Sparkles, Layers } from 'lucide-react';

export type PageId = 'home' | 'test' | 'study_bank' | 'criteria_guide' | 'features_lab';

interface NavigationTabsProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isTestInProgress?: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activePage,
  onSelectPage,
  isTestInProgress,
}) => {
  const tabs: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      label: 'Course Overview',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'test',
      label: 'IELTS Practice Test',
      icon: <Mic className="w-4 h-4 text-rose-500" />,
      badge: isTestInProgress ? 'Active' : 'Live',
    },
    {
      id: 'study_bank',
      label: 'Question & Vocab Bank',
      icon: <HelpCircle className="w-4 h-4 text-orange-400" />,
    },
    {
      id: 'criteria_guide',
      label: 'Band Descriptors',
      icon: <Award className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'features_lab',
      label: 'Features & Practice Lab',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      badge: 'Interactive',
    },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-inner sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPage(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 text-white shadow-md ring-2 ring-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
                id={`nav-tab-${tab.id}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
