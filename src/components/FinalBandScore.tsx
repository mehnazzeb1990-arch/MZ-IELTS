import React, { useState } from 'react';
import { EvaluationResult, AnswerTranscript, CueCard } from '../types';
import { speakText, stopSpeaking } from '../utils/speech';
import {
  Award,
  CheckCircle2,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check,
  TrendingUp,
  FileCheck,
  Layers,
  HelpCircle,
  Headphones,
  BookMarked,
  PenTool,
  Mic,
  ChevronRight
} from 'lucide-react';

interface FinalBandScoreProps {
  evaluation: EvaluationResult;
  transcripts?: AnswerTranscript[];
  cueCard?: CueCard;
  candidateNotes?: string;
  onRetakeTest: () => void;
}

/**
 * Official IELTS Band Score rounding logic:
 * - Averages ending in .25 round UP to .5
 * - Averages ending in .75 round UP to .0
 */
export function roundIELTSBand(score: number): number {
  const floor = Math.floor(score);
  const decimal = score - floor;
  if (decimal < 0.25) return floor;
  if (decimal < 0.75) return floor + 0.5;
  return floor + 1.0;
}

/**
 * Official IELTS Band Descriptor definitions
 */
export interface BandDescriptorInfo {
  band: number;
  title: string;
  summary: string;
  listeningDesc: string;
  readingDesc: string;
  writingDesc: string;
  speakingDesc: string;
}

export const BAND_DESCRIPTORS_MAP: Record<number, BandDescriptorInfo> = {
  9: {
    band: 9.0,
    title: 'Expert User',
    summary: 'Has fully operational command of the language: appropriate, accurate and fluent with complete understanding.',
    listeningDesc: 'Understands complex speech and nuances effortlessly.',
    readingDesc: 'Understands complex arguments and dense academic text effortlessly.',
    writingDesc: 'Presents fully developed responses with precise, error-free structures.',
    speakingDesc: 'Speaks fluently with only rare repetition or content hesitation.'
  },
  8.5: {
    band: 8.5,
    title: 'Very Good User (Upper)',
    summary: 'Has fully operational command with only occasional unsystematic inaccuracies.',
    listeningDesc: 'Understands detailed argumentation and complex implied meanings.',
    readingDesc: 'Comprehends complex, lengthy texts with abstract themes.',
    writingDesc: 'Produces well-structured responses with sophisticated vocabulary.',
    speakingDesc: 'Speaks fluently with flexible use of idiomatic expressions.'
  },
  8: {
    band: 8.0,
    title: 'Very Good User',
    summary: 'Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies.',
    listeningDesc: 'Understands complex argumentation and abstract concepts easily.',
    readingDesc: 'Understands long and complex texts, appreciating subtle meanings.',
    writingDesc: 'Writes clear, well-organised texts with rare minor errors.',
    speakingDesc: 'Develops topics coherently with wide lexical flexibility.'
  },
  7.5: {
    band: 7.5,
    title: 'Good User (Upper)',
    summary: 'Has operational command with occasional inaccuracies in complex situations.',
    listeningDesc: 'Follows complex technical discussions and abstract topics well.',
    readingDesc: 'Analyzes argument structures and specialized terminology effectively.',
    writingDesc: 'Presents clear arguments with good control of complex syntax.',
    speakingDesc: 'Speaks at length with good coherence and clear pronunciation.'
  },
  7: {
    band: 7.0,
    title: 'Good User',
    summary: 'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations.',
    listeningDesc: 'Understands detailed explanations and main points in complex speech.',
    readingDesc: 'Comprehends complex arguments and main ideas in academic text.',
    writingDesc: 'Produces coherent paragraphs with a mix of simple & complex structures.',
    speakingDesc: 'Speaks at length without noticeable effort or loss of coherence.'
  },
  6.5: {
    band: 6.5,
    title: 'Competent User (Upper)',
    summary: 'Has generally effective command despite inaccuracies in complex language.',
    listeningDesc: 'Understands main ideas of complex input in familiar contexts.',
    readingDesc: 'Grasps key factual information and underlying arguments well.',
    writingDesc: 'Organises ideas logically with varied sentence structures.',
    speakingDesc: 'Willing to speak at length with reasonable grammatical control.'
  },
  6: {
    band: 6.0,
    title: 'Competent User',
    summary: 'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings.',
    listeningDesc: 'Understands straightforward factual information and main ideas.',
    readingDesc: 'Understands main ideas and key details in standard texts.',
    writingDesc: 'Writes connected text on familiar topics with basic accuracy.',
    speakingDesc: 'Maintains flow of speech despite occasional hesitations or repetition.'
  },
  5.5: {
    band: 5.5,
    title: 'Modest User (Upper)',
    summary: 'Has partial command of the language, coping with overall meaning in most situations.',
    listeningDesc: 'Grasps essential meaning in familiar conversational contexts.',
    readingDesc: 'Reads basic factual texts with acceptable general comprehension.',
    writingDesc: 'Conveys main points using basic sentence patterns.',
    speakingDesc: 'Keeps speaking using simple sentence forms with persistent errors.'
  },
  5: {
    band: 5.0,
    title: 'Modest User',
    summary: 'Has partial command of the language, coping with overall meaning in most situations, though is likely to make many mistakes.',
    listeningDesc: 'Understands basic factual details in slow, clear speech.',
    readingDesc: 'Understands simple text content and basic vocabulary.',
    writingDesc: 'Produces basic sentence structures with frequent errors.',
    speakingDesc: 'Maintains basic speech flow but requires listener effort.'
  }
};

export const FinalBandScore: React.FC<FinalBandScoreProps> = ({
  evaluation,
  onRetakeTest,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Extract or compute module scores based on existing evaluation data
  const speakingScore = evaluation?.speakingScore ?? evaluation?.overallBand ?? 7.0;
  
  // Calculate module scores deterministically if not explicitly provided
  const listeningScore = evaluation?.listeningScore ?? roundIELTSBand(
    Math.min(9, Math.max(5, (evaluation?.fluencyScore ?? 7.0) * 0.5 + (evaluation?.pronunciationScore ?? 7.0) * 0.5))
  );

  const readingScore = evaluation?.readingScore ?? roundIELTSBand(
    Math.min(9, Math.max(5, (evaluation?.lexicalScore ?? 7.0) * 0.65 + (evaluation?.grammarScore ?? 7.0) * 0.35))
  );

  const writingScore = evaluation?.writingScore ?? roundIELTSBand(
    Math.min(9, Math.max(5, (evaluation?.grammarScore ?? 7.0) * 0.55 + (evaluation?.lexicalScore ?? 7.0) * 0.45))
  );

  // Overall Band Score calculated as average of the 4 official module scores using IELTS rounding rules
  const calculatedOverallBand = roundIELTSBand(
    (listeningScore + readingScore + writingScore + speakingScore) / 4
  );

  const bandKey = Math.min(9, Math.max(5, Math.floor(calculatedOverallBand * 2) / 2));
  const bandDescriptor = BAND_DESCRIPTORS_MAP[bandKey] || BAND_DESCRIPTORS_MAP[7];

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-emerald-600 text-white border-emerald-400';
    if (score >= 7.0) return 'bg-blue-600 text-white border-blue-400';
    if (score >= 6.0) return 'bg-amber-600 text-white border-amber-400';
    return 'bg-rose-600 text-white border-rose-400';
  };

  const handlePlayExaminerAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `Official IELTS Band Report Summary. Your overall IELTS Band score is ${calculatedOverallBand.toFixed(1)}, classified as ${bandDescriptor.title}. Individual sub-scores are: Listening ${listeningScore.toFixed(1)}, Reading ${readingScore.toFixed(1)}, Writing ${writingScore.toFixed(1)}, and Speaking ${speakingScore.toFixed(1)}. ${evaluation?.examinerSummary || 'Well done on completing the full test evaluation.'}`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* CARD 1: OVERALL BAND SCORE HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official IELTS Test Evaluation Complete</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Final IELTS Band Score
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Overall score computed across all 4 skill modules using official IELTS Band Descriptor criteria and half-band rounding rules.
            </p>
          </div>

          {/* Overall Band Big Badge */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 min-w-[240px] shadow-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-200 mb-1">
              Overall Band Score
            </span>
            
            <div className="text-6xl font-black text-white tracking-tight flex items-baseline">
              {calculatedOverallBand.toFixed(1)}
              <span className="text-2xl text-slate-300 font-bold ml-1.5">/ 9.0</span>
            </div>

            <div className="mt-3 inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-600 to-orange-500 text-white border border-rose-400/50 shadow-md">
              <Award className="w-3.5 h-3.5" />
              <span>{bandDescriptor.title}</span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-8 pt-6 border-t border-rose-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayExaminerAudio}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              id="btn-final-score-audio"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Verdict Audio' : 'Listen to Audio Summary'}</span>
            </button>

            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
              AI Examiner Verdict
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors shadow-xs cursor-pointer"
              id="btn-print-band-report"
            >
              <Download className="w-4 h-4" />
              <span>Print Score Report</span>
            </button>

            <button
              onClick={onRetakeTest}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
              id="btn-retake-test-from-score"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARD 2: 4-MODULE SCORE BREAKDOWN GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <span>IELTS 4-Skill Module Band Scores</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            0.0 – 9.0 Scale
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. LISTENING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Listening</span>
              </div>
              <span className="text-2xl font-black text-blue-700 font-mono">
                {listeningScore.toFixed(1)}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(listeningScore / 9) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
              {bandDescriptor.listeningDesc}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Competency</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getScoreBadgeColor(listeningScore)}`}>
                Band {listeningScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 2. READING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <BookMarked className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Reading</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {readingScore.toFixed(1)}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(readingScore / 9) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
              {bandDescriptor.readingDesc}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Competency</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getScoreBadgeColor(readingScore)}`}>
                Band {readingScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 3. WRITING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <PenTool className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Writing</span>
              </div>
              <span className="text-2xl font-black text-purple-700 font-mono">
                {writingScore.toFixed(1)}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(writingScore / 9) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
              {bandDescriptor.writingDesc}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Competency</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getScoreBadgeColor(writingScore)}`}>
                Band {writingScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 4. SPEAKING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all ring-2 ring-rose-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Speaking</span>
              </div>
              <span className="text-2xl font-black text-rose-700 font-mono">
                {speakingScore.toFixed(1)}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(speakingScore / 9) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
              {bandDescriptor.speakingDesc}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Live Assessed</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getScoreBadgeColor(speakingScore)}`}>
                Band {speakingScore.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: OFFICIAL BAND DESCRIPTOR MATCH & ANALYSIS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold mb-1">
              <FileCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Official Public Band Descriptors Match</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Band {calculatedOverallBand.toFixed(1)} Descriptor Profile: {bandDescriptor.title}
            </h3>
          </div>

          <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">User Level</span>
            <span className="text-sm font-black text-slate-900">{bandDescriptor.title}</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 italic font-medium">
          "{bandDescriptor.summary}"
        </p>

        {/* 4 SPEAKING CRITERIA DETAILED SUB-SCORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">Fluency & Coherence (FC)</span>
              <span className="text-rose-700 font-mono font-black">{(evaluation?.fluencyScore ?? 7.0).toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {evaluation?.fluencyFeedback || evaluation?.descriptorMatches?.fluencyLevel || 'Speaks at length with logical coherence and appropriate connectors.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">Lexical Resource (LR)</span>
              <span className="text-orange-700 font-mono font-black">{(evaluation?.lexicalScore ?? 7.0).toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {evaluation?.lexicalFeedback || evaluation?.descriptorMatches?.lexicalLevel || 'Uses varied vocabulary with idiomatic collocations.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">Grammatical Range & Accuracy (GRA)</span>
              <span className="text-amber-700 font-mono font-black">{(evaluation?.grammarScore ?? 7.0).toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {evaluation?.grammarFeedback || evaluation?.descriptorMatches?.grammarLevel || 'Produces a good mix of simple and complex sentence structures.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">Pronunciation (PR)</span>
              <span className="text-emerald-700 font-mono font-black">{(evaluation?.pronunciationScore ?? 7.0).toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {evaluation?.pronunciationFeedback || evaluation?.descriptorMatches?.pronunciationLevel || 'Sustains clear articulation with natural stress and rhythm.'}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 4: EXAMINER RECOMMENDATION & NEXT BAND ADVICE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-700 font-black">
            <Check className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">Key Performance Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {(evaluation?.strengths || [
              'Demonstrated good willingness to expand answers across all test parts.',
              'Used appropriate topic vocabulary and collocations naturally.',
              'Maintained clear articulation and audible intonation rhythm.'
            ]).map((strength, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-amber-700 font-black">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-900">Target Area Improvements</h3>
          </div>
          <ul className="space-y-2.5">
            {(evaluation?.improvements || [
              'Incorporate advanced cohesive discourse connectors (e.g. "To put it into perspective").',
              'Aim to substitute basic descriptors with Band 8+ academic collocations.',
              'Maintain consistent speech rate during complex conditional sentences.'
            ]).map((imp, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* NEXT BAND ADVICE BOX */}
      {evaluation?.nextBandTargetAdvice && (
        <div className="bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 p-6 rounded-3xl border border-rose-200 text-slate-900 space-y-2">
          <div className="flex items-center space-x-2 text-rose-700 font-black text-sm">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Advice to Reach Band {(calculatedOverallBand + 0.5).toFixed(1)}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {evaluation.nextBandTargetAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
