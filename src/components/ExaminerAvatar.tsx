import React from 'react';
import { Volume2, RefreshCw, Bot, UserCheck } from 'lucide-react';

interface ExaminerAvatarProps {
  currentQuestionText: string;
  isSpeaking: boolean;
  onReplayQuestion: () => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
}

export const ExaminerAvatar: React.FC<ExaminerAvatarProps> = ({
  currentQuestionText,
  isSpeaking,
  onReplayQuestion,
  speechRate,
  onChangeSpeechRate,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-2xl p-5 shadow-xl border border-rose-900/40 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Examiner Profile Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-8 h-8 text-rose-400" />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-base">MZ IELTS Examiner</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <UserCheck className="w-3 h-3 mr-1 text-orange-400" /> AI Academy Certified
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <p className="text-xs text-slate-400 font-medium">Official IELTS Speaking Partner</p>
            </div>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold px-2">Speed:</span>
            {[0.9, 1.0, 1.1].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangeSpeechRate(rate)}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  speechRate === rate
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                id={`btn-speed-${rate}`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Replay Question Button */}
          <button
            onClick={onReplayQuestion}
            disabled={!currentQuestionText}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            id="btn-replay-question"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span>Replay Question</span>
          </button>
        </div>
      </div>

      {/* Examiner Speaking Waves / Audio Visualizer Bar */}
      {isSpeaking && (
        <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-xs font-semibold text-orange-300">AI Examiner is speaking...</span>
          </div>

          {/* Animated sound bars */}
          <div className="flex items-center space-x-1 h-4">
            <div className="w-1 bg-orange-400 rounded-full h-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 bg-rose-400 rounded-full h-3/4 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 bg-amber-400 rounded-full h-full animate-bounce [animation-delay:-0.4s]"></div>
            <div className="w-1 bg-orange-400 rounded-full h-2/3 animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-1 bg-rose-400 rounded-full h-4/5 animate-bounce [animation-delay:-0.35s]"></div>
          </div>
        </div>
      )}
    </div>
  );
};
