import React, { useState, useEffect, useRef } from 'react';
import { CueCard, Part3Question, AnswerTranscript } from '../types';
import { ExaminerAvatar } from './ExaminerAvatar';
import { MicVisualizer } from './MicVisualizer';
import { SpeechHandler, speakText, stopSpeaking } from '../utils/speech';
import { ArrowRight, CheckCircle2, Sparkles, Loader2, HelpCircle } from 'lucide-react';

interface TestStepPart3Props {
  cueCard: CueCard;
  part2Speech: string;
  examinerVoiceEnabled: boolean;
  onPart3Complete: (part3Transcripts: AnswerTranscript[]) => void;
}

export const TestStepPart3: React.FC<TestStepPart3Props> = ({
  cueCard,
  part2Speech,
  examinerVoiceEnabled,
  onPart3Complete,
}) => {
  const [questions, setQuestions] = useState<Part3Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [transcripts, setTranscripts] = useState<AnswerTranscript[]>([]);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [micError, setMicError] = useState<string | null>(null);

  const speechHandlerRef = useRef<SpeechHandler | null>(null);
  const spokenQuestionIdRef = useRef<number | string | null>(null);

  if (!speechHandlerRef.current) {
    speechHandlerRef.current = new SpeechHandler();
  }

  // Fetch dynamic Part 3 follow-up questions from Gemini API backend
  useEffect(() => {
    let isMounted = true;
    async function fetchPart3Questions() {
      setIsLoadingQuestions(true);
      try {
        const response = await fetch('/api/generate-part3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cueCardTitle: cueCard.title,
            topic: cueCard.topic,
            userPart2Speech: part2Speech,
          }),
        });
        const data = await response.json();
        if (isMounted) {
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            // Fallback
            setQuestions([
              { id: 1, question: `How do you think public attitudes toward ${cueCard.topic} have evolved over time?`, focusArea: 'Historical Changes' },
              { id: 2, question: `What role does modern technology play in shaping how people experience ${cueCard.topic}?`, focusArea: 'Technology Impact' },
              { id: 3, question: `Do you believe government policies should regulate or support this area more directly?`, focusArea: 'Policy & Governance' },
              { id: 4, question: `Looking into the future, what major developments do you anticipate in this field?`, focusArea: 'Future Predictions' },
            ]);
          }
          setIsLoadingQuestions(false);
        }
      } catch (err) {
        console.error('Failed to fetch Part 3 questions:', err);
        if (isMounted) {
          setQuestions([
            { id: 1, question: 'In what ways do societal norms influence individual choices regarding this subject?', focusArea: 'Societal Impact' },
            { id: 2, question: 'Compare how young people view this issue versus older generations.', focusArea: 'Generational Comparison' },
            { id: 3, question: 'What are the main advantages and disadvantages associated with this trend?', focusArea: 'Pros & Cons' },
            { id: 4, question: 'What long-term global developments do you anticipate over the next decade?', focusArea: 'Future Trends' },
          ]);
          setIsLoadingQuestions(false);
        }
      }
    }

    fetchPart3Questions();

    return () => {
      isMounted = false;
      stopSpeaking();
    };
  }, [cueCard, part2Speech]);

  const currentQuestion = questions[currentIndex];

  // Speak current Part 3 question
  useEffect(() => {
    if (examinerVoiceEnabled && currentQuestion && !isLoadingQuestions) {
      const questionKey = `p3-${currentQuestion.id}`;
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
  }, [currentIndex, examinerVoiceEnabled, currentQuestion, isLoadingQuestions, speechRate]);

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
      part: 3,
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
      // Completed all 4 Part 3 discussion questions
      onPart3Complete(updatedTranscripts);
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-10 border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Generating Tailored Part 3 Discussion Questions</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          MZ IELTS Speaking Partner is analyzing your Part 2 cue card speech to formulate 4 abstract, in-depth follow-up discussion questions...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">IELTS Part 3</span>
          <h2 className="text-xl font-extrabold text-slate-900">Two-Way Abstract Discussion</h2>
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
            <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-500" />
            Focus: {currentQuestion.focusArea}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Discussion Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          "{currentQuestion.question}"
        </h3>

        <p className="text-xs text-slate-500 italic">
          Tip: Give an extended analytical answer. State your stance, provide reasoning or broader societal examples, and consider counter-arguments.
        </p>
      </div>

      {/* Microphone Component */}
      <MicVisualizer
        isListening={isListening}
        transcript={currentSpeech}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        onChangeTranscript={setCurrentSpeech}
        onClearTranscript={() => setCurrentSpeech('')}
        micError={micError}
        placeholder="Click 'Start Mic' to speak to your AI Examiner, or type your response directly..."
      />

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">
          Recommended response length: ~45 to 75 seconds per question.
        </p>

        <button
          onClick={handleNextQuestion}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          id="btn-part3-next"
        >
          <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Test & Get Band Score'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
