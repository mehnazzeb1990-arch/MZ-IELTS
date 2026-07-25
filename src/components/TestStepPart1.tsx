import React, { useState, useEffect } from 'react';
import { Part1Question, AnswerTranscript } from '../types';
import { ExaminerAvatar } from './ExaminerAvatar';
import { MicVisualizer } from './MicVisualizer';
import { SpeechHandler, speakText, stopSpeaking } from '../utils/speech';
import { ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface TestStepPart1Props {
  questions: Part1Question[];
  examinerVoiceEnabled: boolean;
  onPart1Complete: (transcripts: AnswerTranscript[]) => void;
}

export const TestStepPart1: React.FC<TestStepPart1Props> = ({
  questions,
  examinerVoiceEnabled,
  onPart1Complete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcripts, setTranscripts] = useState<AnswerTranscript[]>([]);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [micError, setMicError] = useState<string | null>(null);

  const speechHandlerRef = React.useRef<SpeechHandler | null>(null);
  const spokenQuestionIdRef = React.useRef<string | null>(null);

  if (!speechHandlerRef.current) {
    speechHandlerRef.current = new SpeechHandler();
  }

  const currentQuestion = questions[currentIndex];

  // Speak question when question changes or voice enabled
  useEffect(() => {
    if (examinerVoiceEnabled && currentQuestion) {
      const questionKey = `p1-${currentQuestion.topic}-${currentQuestion.id}`;
      if (spokenQuestionIdRef.current !== questionKey) {
        spokenQuestionIdRef.current = questionKey;
        setIsSpeaking(true);
        speakText(
          currentQuestion.question,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          speechRate
        );
      }
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [currentIndex, examinerVoiceEnabled, currentQuestion, speechRate]);

  const handleReplayQuestion = () => {
    if (currentQuestion) {
      setIsSpeaking(true);
      speakText(
        currentQuestion.question,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        speechRate
      );
    }
  };

  const handleStartListening = () => {
    setMicError(null);
    stopSpeaking();
    setIsSpeaking(false);
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

  const handleNextQuestion = () => {
    handleStopListening();
    stopSpeaking();

    const newTranscript: AnswerTranscript = {
      part: 1,
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userSpeech: currentSpeech.trim() || '(No verbal response)',
    };

    const updatedTranscripts = [...transcripts, newTranscript];
    setTranscripts(updatedTranscripts);
    setCurrentSpeech('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all 5 Part 1 questions
      onPart1Complete(updatedTranscripts);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">IELTS Part 1</span>
          <h2 className="text-xl font-extrabold text-slate-900">Personal Questions Interview</h2>
        </div>
        <div className="flex items-center space-x-2">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                idx === currentIndex
                  ? 'bg-rose-600 text-white ring-4 ring-rose-100 scale-110'
                  : idx < currentIndex
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              {idx < currentIndex ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* AI Examiner Card */}
      <ExaminerAvatar
        currentQuestionText={currentQuestion.question}
        isSpeaking={isSpeaking}
        onReplayQuestion={handleReplayQuestion}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
      />

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4 border-l-4 border-l-rose-600">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            Topic: {currentQuestion.topic}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          "{currentQuestion.question}"
        </h3>

        <p className="text-xs text-slate-500 italic">
          Tip: Give a direct answer and extend with 2-3 supporting sentences explaining why or giving an example.
        </p>
      </div>

      {/* Microphone Recording Component */}
      <MicVisualizer
        isListening={isListening}
        transcript={currentSpeech}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        onChangeTranscript={setCurrentSpeech}
        onClearTranscript={() => setCurrentSpeech('')}
        micError={micError}
        placeholder="Click 'Start Mic' to speak to your AI Examiner, or type your answer directly..."
      />

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">
          Answer length recommendation: ~20 to 45 seconds per response.
        </p>

        <button
          onClick={handleNextQuestion}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          id="btn-part1-next"
        >
          <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Proceed to Part 2'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
