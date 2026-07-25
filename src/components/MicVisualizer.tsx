import React, { useState } from 'react';
import { Mic, MicOff, Edit3, Trash2, CheckCircle2, AlertCircle, Keyboard } from 'lucide-react';

interface MicVisualizerProps {
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onChangeTranscript: (text: string) => void;
  onClearTranscript: () => void;
  micError?: string | null;
  placeholder?: string;
}

export const MicVisualizer: React.FC<MicVisualizerProps> = ({
  isListening,
  transcript,
  onStartListening,
  onStopListening,
  onChangeTranscript,
  onClearTranscript,
  micError,
  placeholder = 'Click "Start Mic" to speak, or type your response directly in this box...',
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all">
      {/* Mic Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          {/* Main Record Button */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all transform active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-200'
                : 'bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white ring-2 ring-rose-100'
            }`}
            id="btn-mic-toggle"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Mic</span>
              </>
            )}
          </button>

          {/* Status Text */}
          <div className="flex items-center space-x-2 text-xs font-semibold">
            {isListening ? (
              <span className="flex items-center text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping mr-1.5"></span>
                Recording Voice Live...
              </span>
            ) : transcript.length > 0 ? (
              <span className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Response Captured
              </span>
            ) : (
              <span className="text-slate-500 flex items-center">
                <Keyboard className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Mic Ready or Type Answer
              </span>
            )}
          </div>
        </div>

        {/* Edit / Clear Actions */}
        {transcript.length > 0 && (
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              id="btn-edit-transcript"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
            </button>
            <button
              onClick={onClearTranscript}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              id="btn-clear-transcript"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Mic Signal Wave animation when listening */}
      {isListening && (
        <div className="mb-4 bg-slate-950 rounded-xl p-3 flex items-center justify-center space-x-1.5">
          <div className="text-xs text-orange-400 font-mono mr-3">VOICE SIGNAL:</div>
          {[40, 75, 30, 90, 60, 100, 45, 80, 20, 85, 50, 95, 35, 70, 90, 40].map((height, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-rose-500 to-orange-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(12, Math.round(height * Math.random()))}px`,
                animationDuration: `${0.3 + (i % 5) * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Mic Warning or Error Message */}
      {micError && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{micError}</p>
            <p className="mt-0.5 text-amber-800">
              Microphone access can be limited in iframe previews. You can type or paste your response directly into the box below!
            </p>
          </div>
        </div>
      )}

      {/* Transcript Box */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => onChangeTranscript(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`w-full p-4 text-sm rounded-xl border transition-all resize-y focus:outline-hidden ${
            isListening
              ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-100 text-slate-900'
              : transcript
              ? 'border-rose-200 bg-slate-50/50 text-slate-900 focus:border-rose-500 focus:bg-white'
              : 'border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400'
          }`}
          id="textarea-transcript"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Word count: {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words</span>
          {transcript.length > 0 && (
            <span className="text-emerald-600 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready for evaluation
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
