import React from 'react';
import { Sparkles, Mic, Award, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Play, HelpCircle, Layers, Lightbulb, Clock, BookMarked, TrendingUp } from 'lucide-react';
import { IELTSSet } from '../types';
import { SAMPLE_IELTS_SETS } from '../data/ieltsTopics';

interface CourseOverviewPageProps {
  onStartTest: (set: IELTSSet) => void;
  onNavigatePage: (pageId: 'test' | 'study_bank' | 'criteria_guide' | 'features_lab') => void;
}

export const CourseOverviewPage: React.FC<CourseOverviewPageProps> = ({
  onStartTest,
  onNavigatePage,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-rose-900/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>AI Academy • IELTS Speaking Mastery Course</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Transform Your IELTS Speaking Band with <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300">MZ IELTS Speaking Partner</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Welcome to AI Academy's flagship IELTS Speaking prep system. Practice under authentic exam conditions, receive line-by-line grammar corrections, and elevate your vocabulary to Band 8+ with our AI Speaking Partner.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartTest(SAMPLE_IELTS_SETS[0])}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-base shadow-xl hover:shadow-rose-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              id="btn-overview-start-test"
            >
              <Mic className="w-6 h-6 animate-pulse" />
              <span>Start Full Test Now</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <button
              onClick={() => onNavigatePage('study_bank')}
              className="inline-flex items-center space-x-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors cursor-pointer"
              id="btn-overview-explore-bank"
            >
              <BookMarked className="w-4 h-4 text-orange-400" />
              <span>Explore Study & Question Bank</span>
            </button>
          </div>
        </div>
      </section>

      {/* WHY AI ACADEMY FOR IMPROVING SPEAKING */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The AI Academy Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose AI Academy for IELTS Speaking?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Traditional classroom practice often lacks immediate feedback and individualized performance tracking. AI Academy bridges this gap by combining official British IELTS band criteria with Gemini-powered adaptive evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-rose-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">AI Examiner Avatar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides authentic voice readouts, pacing adjustments, and structured questioning across all 3 IELTS speaking parts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-orange-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">4-Criteria Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get immediate diagnostic scores for Fluency (FC), Lexical Resource (LR), Grammar (GRA), and Pronunciation (PR).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Grammar & Vocab Enhancer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recieves tailored line-by-line grammar corrections and Band 8+ collocation upgrades for the phrases you spoke.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-pink-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Official Exam Timers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Train your internal clock with standard 1-minute cue card preparation and 2-minute timed speaking countdowns.
            </p>
          </div>
        </div>
      </section>

      {/* COURSE STRUCTURE & MODULE DESCRIPTION */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Curriculum & Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Course Structure Overview
            </h2>
          </div>
          <button
            onClick={() => onNavigatePage('criteria_guide')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            id="btn-overview-view-criteria"
          >
            View Official Band Descriptors
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/60">
                Module 1
              </span>
              <span className="text-xs text-slate-400">Part 1 Focus</span>
            </div>
            <h3 className="font-extrabold text-white text-lg">Personal Interview & Fluency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master smooth, expanded answers to everyday questions about hometown, study/work, hobbies, and technology without unnatural hesitation.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-rose-400 shrink-0" /> Direct answer + expansion strategy</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-rose-400 shrink-0" /> Avoiding short yes/no answers</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-rose-400 shrink-0" /> Natural discourse markers</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 bg-orange-950/80 px-3 py-1 rounded-full border border-orange-800/60">
                Module 2
              </span>
              <span className="text-xs text-slate-400">Part 2 Focus</span>
            </div>
            <h3 className="font-extrabold text-white text-lg">Cue Card & 2-Minute Monologue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn effective 1-minute cue card note-taking systems and deliver structured, narrative-driven 2-minute talks covering all bullet prompts.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-orange-400 shrink-0" /> Rapid bullet note organization</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-orange-400 shrink-0" /> Storytelling and past tenses</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-orange-400 shrink-0" /> Pacing for full 120 seconds</li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                Module 3
              </span>
              <span className="text-xs text-slate-400">Part 3 Focus</span>
            </div>
            <h3 className="font-extrabold text-white text-lg">Abstract Two-Way Discussion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Develop advanced skills in expressing opinions, evaluating societal trends, speculating about the future, and arguing complex positions.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> Hypothesizing and conditionals</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> High-level academic collocations</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> Responding to Gemini follow-ups</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MZ'S BAND 8+ TIPS */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
            MZ
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Top 5 Golden Rules for Band 8+</h2>
            <p className="text-xs text-slate-500">Essential advice for candidates targeting Band 7.5 to 9</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5">
            <span className="text-xs font-bold text-rose-700">Rule 1: Don't Memorize Prepared Answers</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Examiners quickly recognize memorized speeches by artificial rhythm and loss of natural intonation. Speak naturally and adapt your ideas on the spot.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1.5">
            <span className="text-xs font-bold text-orange-700">Rule 2: Extend Answers Logically</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              In Part 1, aim for 2–3 sentences per question. State your point, give a reason or example, and conclude naturally.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
            <span className="text-xs font-bold text-amber-700">Rule 3: Use Precise Collocations Over Big Words</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Band 8+ lexical resource comes from natural topic-specific collocations (e.g., "bustling metropolis", "streamline workflow") rather than archaic dictionary words.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <span className="text-xs font-bold text-emerald-700">Rule 4: Self-Correct Smoothly</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              If you slip up grammatically, quickly rephrase using phrases like "or rather..." or "what I mean is...". Minor self-correction shows active language control.
            </p>
          </div>
        </div>
      </section>

      {/* ACADEMY NAVIGATION JUMP CARDS */}
      <section className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-3xl p-8 border border-rose-900/40 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Ready to Explore the Academy?</h2>
          <p className="text-xs text-slate-300">Choose a section below to begin your IELTS preparation session.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onStartTest(SAMPLE_IELTS_SETS[0])}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500 text-left transition-all group cursor-pointer space-y-3"
            id="btn-jump-test"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">1. Full IELTS Test</p>
              <p className="text-[11px] text-slate-400 mt-1">Live test with AI Examiner</p>
            </div>
          </button>

          <button
            onClick={() => onNavigatePage('study_bank')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500 text-left transition-all group cursor-pointer space-y-3"
            id="btn-jump-bank"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">2. Study & Question Bank</p>
              <p className="text-[11px] text-slate-400 mt-1">Hidden questions & model audio</p>
            </div>
          </button>

          <button
            onClick={() => onNavigatePage('criteria_guide')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-left transition-all group cursor-pointer space-y-3"
            id="btn-jump-criteria"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">3. Band Descriptors</p>
              <p className="text-[11px] text-slate-400 mt-1">Band 5–9 evaluation criteria</p>
            </div>
          </button>

          <button
            onClick={() => onNavigatePage('features_lab')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500 text-left transition-all group cursor-pointer space-y-3"
            id="btn-jump-lab"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">4. Interactive Features Lab</p>
              <p className="text-[11px] text-slate-400 mt-1">Voice, timers, grammar workbench</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
