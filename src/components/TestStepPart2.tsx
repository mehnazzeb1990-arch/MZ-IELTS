import React, { useState, useEffect, useRef } from 'react';
import { CueCard, AnswerTranscript } from '../types';
import { ExaminerAvatar } from './ExaminerAvatar';
import { MicVisualizer } from './MicVisualizer';
import { SpeechHandler, speakText, stopSpeaking, playChime } from '../utils/speech';
import { Clock, Play, FileText, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface TestStepPart2Props {
  cueCard: CueCard;
  examinerVoiceEnabled: boolean;
  onPart2Complete: (transcript: AnswerTranscript, candidateNotes: string) => void;
}

export const TestStepPart2: React.FC<TestStepPart2Props> = ({
  cueCard,
  examinerVoiceEnabled,
  onPart2Complete,
}) => {
  // Phase states: 'intro' | 'prep' | 'speak' | 'review'
  const [phase, setPhase] = useState<'intro' | 'prep' | 'speak' | 'review'>('intro');

  // Timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60); // 60s
  const [speakTimeLeft, setSpeakTimeLeft] = useState(120); // 120s (2 mins)

  const [notes, setNotes] = useState('');
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [micError, setMicError] = useState<string | null>(null);

  const speechHandlerRef = useRef<SpeechHandler | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spokenIntroKeyRef = useRef<string | null>(null);

  if (!speechHandlerRef.current) {
    speechHandlerRef.current = new SpeechHandler();
  }

  // Speak initial instruction
  useEffect(() => {
    if (examinerVoiceEnabled && phase === 'intro') {
      const introKey = `${cueCard.id}-${phase}`;
      if (spokenIntroKeyRef.current !== introKey) {
        spokenIntroKeyRef.current = introKey;
        const promptText = `Part 2: Here is your Cue Card topic. ${cueCard.title}. You have 1 minute to prepare your notes, and then 2 minutes to speak.`;
        setIsSpeaking(true);
        speakText(promptText, () => setIsSpeaking(true), () => setIsSpeaking(false), speechRate);
      }
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase, examinerVoiceEnabled, cueCard, speechRate]);

  // Handle 1-Min Prep Countdown
  useEffect(() => {
    if (phase === 'prep') {
      playChime('prep_start');
      timerIntervalRef.current = setInterval(() => {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            playChime('prep_done');
            setPhase('speak');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase]);

  // Handle 2-Min Speaking Countdown
  useEffect(() => {
    if (phase === 'speak') {
      // Auto-start microphone recording
      handleStartListening();

      timerIntervalRef.current = setInterval(() => {
        setSpeakTimeLeft((prev) => {
          if (prev === 30) {
            playChime('timer_warning');
          }
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            handleStopListening();
            playChime('prep_done');
            setPhase('review');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase]);

  const handleStartPrep = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setPhase('prep');
  };

  const handleStartListening = () => {
    setMicError(null);
    setIsListening(true);
    speechHandlerRef.current?.startListening(
      (text) => {
        setCurrentSpeech(text);
      },
      (err) => {
        setMicError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    speechHandlerRef.current?.stopListening();
    setIsListening(false);
  };

  const handleFinishPart2 = () => {
    handleStopListening();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const transcript: AnswerTranscript = {
      part: 2,
      questionId: 1,
      questionText: cueCard.title,
      userSpeech: currentSpeech.trim() || '(No response recorded for Cue Card)',
      durationSeconds: 120 - speakTimeLeft,
    };

    onPart2Complete(transcript, notes);
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">IELTS Part 2</span>
          <h2 className="text-xl font-extrabold text-slate-900">Individual Long Turn (Cue Card)</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              phase === 'prep'
                ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300'
                : phase === 'speak'
                ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300'
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}
          >
            {phase === 'intro' && 'Ready for 1-Min Prep'}
            {phase === 'prep' && `Preparation Time: ${formatTime(prepTimeLeft)}`}
            {phase === 'speak' && `Speaking Time: ${formatTime(speakTimeLeft)}`}
            {phase === 'review' && 'Part 2 Complete'}
          </span>
        </div>
      </div>

      {/* AI Examiner Card */}
      <ExaminerAvatar
        currentQuestionText={cueCard.title}
        isSpeaking={isSpeaking}
        onReplayQuestion={() => {
          setIsSpeaking(true);
          speakText(cueCard.title, () => setIsSpeaking(true), () => setIsSpeaking(false), speechRate);
        }}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
      />

      {/* Official IELTS Cue Card Container */}
      <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-5 relative">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-700" />
            <span className="font-extrabold text-amber-900 text-sm tracking-wide uppercase">
              Candidate Task Card
            </span>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-md">
            Topic: {cueCard.topic}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          {cueCard.title}
        </h3>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            You should say:
          </p>
          <ul className="space-y-2 pl-2">
            {cueCard.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-sm text-slate-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-100/60 p-3 rounded-xl text-xs text-amber-900 border border-amber-200 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{cueCard.tips}</span>
        </div>
      </div>

      {/* Preparation Timer & Scratchpad Notes Area */}
      {phase === 'intro' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="max-w-md mx-auto space-y-2">
            <Clock className="w-10 h-10 text-orange-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 text-lg">1-Minute Preparation Phase</h4>
            <p className="text-xs text-slate-600">
              When you click "Start 1-Min Prep", a 60-second timer will begin. You can type bullet notes below to organize your ideas.
            </p>
          </div>

          <button
            onClick={handleStartPrep}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            id="btn-start-prep"
          >
            <Play className="w-4 h-4" />
            <span>Start 1-Minute Preparation</span>
          </button>
        </div>
      )}

      {(phase === 'prep' || phase === 'speak' || phase === 'review') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timer Status Gauge */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              {phase === 'prep' ? 'Preparation Clock' : 'Speaking Clock'}
            </span>

            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  className={
                    phase === 'prep'
                      ? 'text-amber-500 transition-all duration-1000'
                      : 'text-rose-500 transition-all duration-1000'
                  }
                  strokeDasharray={326}
                  strokeDashoffset={
                    phase === 'prep'
                      ? 326 - (326 * prepTimeLeft) / 60
                      : 326 - (326 * speakTimeLeft) / 120
                  }
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-black text-2xl text-slate-900 font-mono">
                {phase === 'prep' ? formatTime(prepTimeLeft) : formatTime(speakTimeLeft)}
              </span>
            </div>

            {phase === 'prep' && (
              <button
                onClick={() => {
                  if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                  setPhase('speak');
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                id="btn-skip-prep"
              >
                Skip Prep & Start Speaking Now
              </button>
            )}

            {phase === 'speak' && (
              <p className="text-[11px] text-slate-500 font-medium">
                {speakTimeLeft > 30 ? 'Aim to speak for full 2 minutes' : '⚠️ 30s remaining! Wrap up concluding thoughts.'}
              </p>
            )}
          </div>

          {/* Candidate Scratchpad / Notes */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-indigo-600" /> Candidate Notes Scratchpad
              </label>
              <span className="text-[10px] text-slate-400">Visible for reference during speech</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="- Point 1: Where & when...\n- Point 2: Who took part...\n- Point 3: Key events...\n- Vocabulary: unforgettable, picturesque..."
              rows={5}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 font-mono text-slate-800 focus:outline-hidden"
              id="textarea-cue-notes"
            />
          </div>
        </div>
      )}

      {/* Microphone Component during Speaking / Review */}
      {(phase === 'speak' || phase === 'review') && (
        <MicVisualizer
          isListening={isListening}
          transcript={currentSpeech}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onChangeTranscript={setCurrentSpeech}
          onClearTranscript={() => setCurrentSpeech('')}
          micError={micError}
          placeholder="Speak continuously for 2 minutes covering all cue card points..."
        />
      )}

      {/* Proceed to Part 3 Footer CTA */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">
          Target Duration: 1 min 30 sec to 2 min 00 sec.
        </p>

        <button
          onClick={handleFinishPart2}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          id="btn-part2-finish"
        >
          <span>Finish Part 2 & Generate Part 3 Questions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
