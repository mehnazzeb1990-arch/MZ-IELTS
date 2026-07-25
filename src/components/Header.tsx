import React from 'react';
import { Award, Mic, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { TestPart } from '../types';

interface HeaderProps {
  currentPart: TestPart;
  examinerVoiceEnabled: boolean;
  onToggleExaminerVoice: () => void;
  onRestartTest: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPart,
  examinerVoiceEnabled,
  onToggleExaminerVoice,
  onRestartTest,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <button
          onClick={onGoHome}
          className="flex items-center space-x-3 text-left group focus:outline-hidden cursor-pointer"
          id="btn-header-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            MZ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">MZ IELTS</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                <Sparkles className="w-3 h-3 mr-1 text-orange-400" /> Speaking Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">AI Band Evaluator</p>
          </div>
        </button>

        {/* Current Test Status Badge */}
        {currentPart !== 'home' && currentPart !== 'results' && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span>
              {currentPart === 'part1' && 'Part 1: Introduction & Personal Questions'}
              {currentPart === 'part2_prep' && 'Part 2: Cue Card 1-Min Preparation'}
              {currentPart === 'part2_speak' && 'Part 2: Cue Card 2-Min Speech'}
              {currentPart === 'part3' && 'Part 3: Dynamic Discussion'}
            </span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* AI Voice Toggle */}
          <button
            onClick={onToggleExaminerVoice}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
              examinerVoiceEnabled
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/80 hover:bg-rose-900/80'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Examiner Voice Readout"
            id="btn-toggle-voice"
          >
            {examinerVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Voice Off</span>
              </>
            )}
          </button>

          {/* Test Reset CTA */}
          {currentPart !== 'home' && (
            <button
              onClick={onRestartTest}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              id="btn-reset-test"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Reset Test</span>
            </button>
          )}

          <a
            href="#about-section"
            onClick={(e) => {
              if (currentPart !== 'home') {
                e.preventDefault();
                onGoHome();
                setTimeout(() => {
                  document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-rose-400 px-2 py-1 cursor-pointer"
          >
            <Award className="w-4 h-4 text-orange-400" />
            <span>Band Descriptors</span>
          </a>
        </div>
      </div>
    </header>
  );
};
