import React, { useState } from 'react';
import { EvaluationResult, AnswerTranscript, CueCard } from '../types';
import { FinalBandScore } from './FinalBandScore';
import { speakText, stopSpeaking } from '../utils/speech';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Table,
  Target,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';

interface ResultsPageProps {
  evaluation: EvaluationResult;
  transcripts: AnswerTranscript[];
  cueCard: CueCard;
  candidateNotes: string;
  onRetakeTest: () => void;
}

// Official IELTS Public Band Descriptors Data
const OFFICIAL_BAND_DESCRIPTORS = [
  {
    band: 9.0,
    title: 'Expert User',
    fc: 'Speaks fluently with only rare repetition or self-correction. Any hesitation is content-related. Speaks coherently with fully appropriate cohesive features.',
    lr: 'Uses vocabulary with full flexibility and precision in all topics. Uses idiomatic language naturally and accurately.',
    gra: 'Uses a full range of structures naturally and appropriately. Produces consistently accurate structures with error-free sentences.',
    pr: 'Uses a full range of pronunciation features with precision and subtlety. Effortless to understand.',
  },
  {
    band: 8.0,
    title: 'Very Good User',
    fc: 'Speaks fluently with only occasional repetition or self-correction. Develops topics coherently and appropriately.',
    lr: 'Uses a wide vocabulary resource flexibly to convey precise meaning. Uses less common and idiomatic items skillfully with rare errors.',
    gra: 'Uses a wide range of structures flexibly. Produces a majority of error-free sentences with only occasional basic slips.',
    pr: 'Uses a wide range of pronunciation features. Sustains flexible use of features throughout. Easy to understand.',
  },
  {
    band: 7.0,
    title: 'Good User',
    fc: 'Speaks at length without noticeable effort or loss of coherence. Uses a range of connectives and discourse markers with some flexibility.',
    lr: 'Uses vocabulary flexibly for general and specific topics. Uses some less common and idiomatic items with awareness of collocation.',
    gra: 'Uses a mix of simple and complex structures with good control. Produces frequent error-free sentences.',
    pr: 'Shows positive features of Band 6 and some features of Band 8. Generally clear and easy to understand.',
  },
  {
    band: 6.0,
    title: 'Competent User',
    fc: 'Is willing to speak at length, though may lose coherence at times due to hesitation or repetition. Uses a range of connectives.',
    lr: 'Has a wide enough vocabulary to discuss topics at length and make meaning clear despite inaccuracies. Generally paraphrases successfully.',
    gra: 'Uses a mix of simple and complex structures, but with limited flexibility. May make frequent errors in complex sentences.',
    pr: 'Uses a range of pronunciation features with mixed control. Mispronunciations occur but clarity is maintained.',
  },
  {
    band: 5.0,
    title: 'Modest User',
    fc: 'Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going. May over-use connectives.',
    lr: 'Manages to talk about familiar and unfamiliar topics, but uses vocabulary with limited flexibility. Paraphrases with limited success.',
    gra: 'Produces basic sentence forms with reasonable accuracy. Uses a limited range of complex structures with persistent errors.',
    pr: 'Shows control of some pronunciation features but reduced clarity occurs periodically. Requires listener effort.',
  },
];

export const ResultsPage: React.FC<ResultsPageProps> = ({
  evaluation,
  transcripts,
  cueCard,
  candidateNotes,
  onRetakeTest,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'part_feedback' | 'descriptors' | 'grammar' | 'vocab' | 'transcript'>('overview');
  const [expandedParts, setExpandedParts] = useState<{ [key: number]: boolean }>({ 1: true, 2: true, 3: true });
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const togglePartExpand = (part: number) => {
    setExpandedParts((prev) => ({ ...prev, [part]: !prev[part] }));
  };

  const getBandBadgeColor = (score: number) => {
    if (score >= 8.0) return 'bg-emerald-600 text-white border-emerald-400';
    if (score >= 7.0) return 'bg-blue-600 text-white border-blue-400';
    if (score >= 6.0) return 'bg-amber-600 text-white border-amber-400';
    return 'bg-rose-600 text-white border-rose-400';
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handlePlayExaminerAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const overallBandNum = evaluation?.overallBand ?? 7.0;
    const textToSpeak = `This is your MZ IELTS Speaking Partner. Your estimated overall IELTS Band score is ${overallBandNum.toFixed(
      1
    )}. Summary: ${evaluation?.examinerSummary || 'Great performance across all 3 parts of the IELTS test.'} ${
      evaluation?.nextBandTargetAdvice ? 'Advice to reach your next band: ' + evaluation.nextBandTargetAdvice : ''
    }`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* FINAL BAND SCORE REPORT CARD */}
      <FinalBandScore
        evaluation={evaluation}
        transcripts={transcripts}
        cueCard={cueCard}
        candidateNotes={candidateNotes}
        onRetakeTest={onRetakeTest}
      />

      {/* 4 CRITERIA BREAKDOWN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fluency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fluency & Coherence</span>
            <span className="text-xl font-black text-rose-700 font-mono">{(evaluation?.fluencyScore ?? 7.0).toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-rose-600 h-2 rounded-full"
              style={{ width: `${((evaluation?.fluencyScore ?? 7.0) / 9) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{evaluation?.fluencyFeedback || 'Good speaking flow with cohesive links.'}</p>
        </div>

        {/* Lexical Resource */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lexical Resource</span>
            <span className="text-xl font-black text-orange-700 font-mono">{(evaluation?.lexicalScore ?? 7.0).toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{ width: `${((evaluation?.lexicalScore ?? 7.0) / 9) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{evaluation?.lexicalFeedback || 'Effective vocabulary usage with idiomatic awareness.'}</p>
        </div>

        {/* Grammar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Grammar & Accuracy</span>
            <span className="text-xl font-black text-amber-700 font-mono">{(evaluation?.grammarScore ?? 7.0).toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${((evaluation?.grammarScore ?? 7.0) / 9) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{evaluation?.grammarFeedback || 'Flexible complex structure usage with high control.'}</p>
        </div>

        {/* Pronunciation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pronunciation</span>
            <span className="text-xl font-black text-emerald-700 font-mono">{(evaluation?.pronunciationScore ?? 7.0).toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${((evaluation?.pronunciationScore ?? 7.0) / 9) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{evaluation?.pronunciationFeedback || 'Clear pronunciation with natural stress features.'}</p>
        </div>
      </div>

      {/* NAVIGATION TABS FOR DETAILED ANALYSIS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-overview"
          >
            <Award className="w-4 h-4 text-rose-600" />
            <span>Overview & Target Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('part_feedback')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'part_feedback'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-part-feedback"
          >
            <Layers className="w-4 h-4 text-orange-600" />
            <span>Part 1, 2 & 3 Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('descriptors')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'descriptors'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-descriptors"
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Band Descriptors Match</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'grammar'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-grammar"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Grammar Corrections ({evaluation.grammarCorrections?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'vocab'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-vocab"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Vocabulary Upgrades ({evaluation.vocabSuggestions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-5 py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'transcript'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            id="tab-transcript"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Full Speech Transcript</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ROADMAP */}
        {activeTab === 'overview' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Examiner Summary */}
            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-blue-600" /> Senior Examiner Verdict
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                  Official Verdict
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                "{evaluation.examinerSummary}"
              </p>
            </div>

            {/* ROADMAP TO NEXT BAND TARGET */}
            {evaluation.nextBandTargetAdvice && (
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl border border-emerald-700 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Roadmap to Reach Band {(evaluation.overallBand + 0.5).toFixed(1)} - {(evaluation.overallBand + 1.0).toFixed(1)}+</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  {evaluation.nextBandTargetAdvice}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Key Strengths Demonstrated
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths?.map((strength, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 space-y-3">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600" /> Key Focus Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {evaluation.improvements?.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-800 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PART-BY-PART EXAMINER FEEDBACK */}
        {activeTab === 'part_feedback' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Part-by-Part Examiner Breakdown</h3>
              <p className="text-xs text-slate-500">
                Examiner observations on candidate performance across the 3 distinct IELTS test sections:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Part 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                    Part 1
                  </span>
                  <span className="text-xs font-bold text-slate-700">Introduction & Personal</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Warm-up & Familiar Topics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evaluation.part1Feedback || 'Demonstrated good immediate fluency with extended answers on personal topics.'}
                </p>
              </div>

              {/* Part 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                    Part 2
                  </span>
                  <span className="text-xs font-bold text-slate-700">Cue Card Monologue</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">2-Minute Long Turn</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evaluation.part2Feedback || 'Delivered a structured monologue addressing all key bullet points with good narrative flow.'}
                </p>
              </div>

              {/* Part 3 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Part 3
                  </span>
                  <span className="text-xs font-bold text-slate-700">Abstract Discussion</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Analytical Discussion</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evaluation.part3Feedback || 'Engaged thoughtfully with complex analytical questions, justifying opinions with reasons.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL BAND DESCRIPTORS MATRIX */}
        {activeTab === 'descriptors' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Table className="w-4 h-4 mr-2 text-emerald-600" />
                Official IELTS Public Band Descriptors Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Compare your speech performance directly against official criteria benchmarks:
              </p>
            </div>

            {/* Candidate Matched Descriptors Card */}
            {evaluation.descriptorMatches && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Your Matched Descriptor Clauses
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                    <span className="font-bold text-blue-400 text-[10px] uppercase">Fluency Match:</span>
                    <p className="text-slate-300 text-xs">{evaluation.descriptorMatches.fluencyLevel}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                    <span className="font-bold text-indigo-400 text-[10px] uppercase">Lexical Match:</span>
                    <p className="text-slate-300 text-xs">{evaluation.descriptorMatches.lexicalLevel}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                    <span className="font-bold text-purple-400 text-[10px] uppercase">Grammar Match:</span>
                    <p className="text-slate-300 text-xs">{evaluation.descriptorMatches.grammarLevel}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                    <span className="font-bold text-emerald-400 text-[10px] uppercase">Pronunciation Match:</span>
                    <p className="text-slate-300 text-xs">{evaluation.descriptorMatches.pronunciationLevel}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Official Descriptor Levels Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Public Band Scale Breakdown (Band 5 to Band 9)
              </h4>

              <div className="space-y-3">
                {OFFICIAL_BAND_DESCRIPTORS.map((item) => {
                  const isUserCurrentBand = Math.floor(evaluation.overallBand) === Math.floor(item.band);

                  return (
                    <div
                      key={item.band}
                      className={`p-5 rounded-2xl border transition-all ${
                        isUserCurrentBand
                          ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-slate-900 font-mono">
                            Band {item.band.toFixed(1)}
                          </span>
                          <span className="text-xs font-bold text-slate-600">({item.title})</span>
                        </div>

                        {isUserCurrentBand && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Your Current Level
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <strong className="text-blue-800 text-[10px] uppercase block">Fluency & Coherence:</strong>
                          <p className="text-slate-700 leading-snug">{item.fc}</p>
                        </div>

                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <strong className="text-indigo-800 text-[10px] uppercase block">Lexical Resource:</strong>
                          <p className="text-slate-700 leading-snug">{item.lr}</p>
                        </div>

                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <strong className="text-purple-800 text-[10px] uppercase block">Grammatical Range:</strong>
                          <p className="text-slate-700 leading-snug">{item.gra}</p>
                        </div>

                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <strong className="text-emerald-800 text-[10px] uppercase block">Pronunciation:</strong>
                          <p className="text-slate-700 leading-snug">{item.pr}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GRAMMAR CORRECTIONS */}
        {activeTab === 'grammar' && (
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Review specific grammatical errors detected from your spoken transcript, with Band 8+ refined equivalents:
            </p>

            <div className="space-y-4">
              {evaluation.grammarCorrections?.map((item, index) => (
                <div key={index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                      Part {item.part} Speech
                    </span>
                    <span className="text-xs text-purple-700 font-semibold">Grammar Correction #{index + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase">Original Speech:</span>
                      <p className="font-mono text-rose-900 text-xs">"{item.original}"</p>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Improved Band 8.5 Version:</span>
                      <p className="font-mono text-emerald-900 text-xs font-semibold">"{item.corrected}"</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                    💡 <strong className="text-slate-800 font-bold">Rule:</strong> {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VOCABULARY SUGGESTIONS */}
        {activeTab === 'vocab' && (
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Elevate your Lexical Resource score with these idiomatic and academic vocabulary enhancements:
            </p>

            <div className="space-y-4">
              {evaluation.vocabSuggestions?.map((item, index) => (
                <div key={index} className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-200/60 text-amber-900">
                      Part {item.part}
                    </span>
                    <span className="text-xs text-amber-800 font-bold">Lexical Upgrade #{index + 1}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="bg-white p-3 rounded-xl border border-amber-200 flex-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Used Phrase:</span>
                      <p className="font-semibold text-slate-800 text-xs mt-0.5">"{item.originalPhrase}"</p>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-amber-600 self-center hidden sm:block shrink-0" />

                    <div className="bg-amber-100 p-3 rounded-xl border border-amber-300 flex-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Band 8+ Alternative:</span>
                      <p className="font-bold text-amber-950 text-xs mt-0.5">"{item.advancedAlternative}"</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-200">
                    🎯 <strong className="text-slate-900 font-bold">Context & Idiom Note:</strong> {item.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FULL SPEECH TRANSCRIPT */}
        {activeTab === 'transcript' && (
          <div className="p-6 sm:p-8 space-y-6">
            {[1, 2, 3].map((partNum) => {
              const partTranscripts = transcripts.filter((t) => t.part === partNum);
              if (partTranscripts.length === 0) return null;

              return (
                <div key={partNum} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => togglePartExpand(partNum)}
                    className="w-full bg-slate-50 px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-sm">
                      Part {partNum} Transcripts ({partTranscripts.length} Items)
                    </span>
                    {expandedParts[partNum] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expandedParts[partNum] && (
                    <div className="p-5 space-y-4 bg-white divide-y divide-slate-100">
                      {partTranscripts.map((t, idx) => (
                        <div key={idx} className="pt-3 first:pt-0 space-y-2">
                          <p className="text-xs font-bold text-blue-700">
                            Examiner Q: "{t.questionText}"
                          </p>
                          <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-800 font-mono">
                            <span className="font-sans font-bold text-slate-500 block text-[10px] uppercase mb-1">Candidate Spoken Response:</span>
                            "{t.userSpeech}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

