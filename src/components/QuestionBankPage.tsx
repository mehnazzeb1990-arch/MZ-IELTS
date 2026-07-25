import React, { useState } from 'react';
import { BookMarked, ChevronDown, ChevronUp, Volume2, Sparkles, HelpCircle, Lightbulb, Search, CheckCircle2, Play } from 'lucide-react';
import { IELTSSet, SampleQuestionWithAnswer, TopicVocabItem } from '../types';
import { SAMPLE_IELTS_SETS } from '../data/ieltsTopics';
import { speakText, stopSpeaking } from '../utils/speech';

interface QuestionBankPageProps {
  onSelectSetForTest: (set: IELTSSet) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ onSelectSetForTest }) => {
  const [selectedSet, setSelectedSet] = useState<IELTSSet>(SAMPLE_IELTS_SETS[0]);
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'vocab'>('part1');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [expandedVocabIndex, setExpandedVocabIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingAnswerId, setSpeakingAnswerId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const toggleVocab = (index: number) => {
    setExpandedVocabIndex(expandedVocabIndex === index ? null : index);
  };

  const handleSpeakText = (id: number, text: string) => {
    if (speakingAnswerId === id) {
      stopSpeaking();
      setSpeakingAnswerId(null);
    } else {
      stopSpeaking();
      setSpeakingAnswerId(id);
      speakText(
        text,
        () => setSpeakingAnswerId(id),
        () => setSpeakingAnswerId(null),
        1.0
      );
    }
  };

  // Filter Part 1 Questions
  const filteredPart1 = selectedSet.part1Questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER HERO */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-8 shadow-2xl border border-rose-900/40 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-xs font-bold">
          <BookMarked className="w-4 h-4 text-orange-400" />
          <span>Interactive Study & Question Bank</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          IELTS Question & Vocabulary Repository
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Questions are hidden by default. Click any topic or question to reveal it one-by-one, study Band 8.5 model answers, listen to AI audio readouts, and master topic collocations.
        </p>

        {/* SET SELECTOR PILLS */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Topic Module:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_IELTS_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => {
                  setSelectedSet(set);
                  setExpandedQuestionId(null);
                  setExpandedVocabIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSet.id === set.id
                    ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md ring-2 ring-rose-400/50'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
                id={`btn-bank-set-${set.id}`}
              >
                {set.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH AND TABS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('part1')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'part1'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-part1-questions"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Part 1 Questions ({selectedSet.part1Questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('part2')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'part2'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-part2-cue"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Part 2 Cue Card</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-vocab-bank"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Topic Vocabulary ({selectedSet.relevantVocab?.length || 0})</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or topic keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all"
            id="input-bank-search"
          />
        </div>
      </div>

      {/* CONTENT TAB 1: PART 1 QUESTIONS (COLLAPSIBLE ONE BY ONE) */}
      {activeTab === 'part1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Part 1 Questions for <span className="text-rose-600">{selectedSet.title}</span>
            </h2>
            <span className="text-xs text-slate-500">Click any question card to reveal model answer & tips</span>
          </div>

          <div className="space-y-3">
            {filteredPart1.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id;
              // Find matching model answer if available
              const modelObj = selectedSet.sampleModelAnswers?.find(
                (m) => m.part === 1 && m.topic.toLowerCase() === q.topic.toLowerCase()
              );

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-rose-300"
                >
                  {/* Question Header Button (One-by-one Toggle) */}
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                    id={`btn-question-toggle-${q.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                        Q{idx + 1}
                      </span>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          {q.topic}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{q.question}</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                        {isExpanded ? 'Hide Answer' : 'Click to Reveal'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Model Answer & Analysis Panel */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                      {modelObj ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Band 8.5 Model Response
                            </span>

                            <button
                              onClick={() => handleSpeakText(q.id, modelObj.modelAnswer)}
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                speakingAnswerId === q.id
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              }`}
                              id={`btn-speak-question-${q.id}`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{speakingAnswerId === q.id ? 'Stop Voice' : 'Listen Answer'}</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-800 leading-relaxed font-medium italic bg-white p-3.5 rounded-xl border border-slate-200/80">
                            "{modelObj.modelAnswer}"
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-slate-500 font-bold">Key Vocabulary Used:</span>
                            {modelObj.keyVocabUsed.map((v, i) => (
                              <span
                                key={i}
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] px-2 py-0.5 rounded-md"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-700">Recommended Answer Strategy:</p>
                          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                            Aim for 2–3 sentences. Start with a direct answer statement, provide 1 supporting reason or personal detail, and conclude naturally using topic collocations.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT TAB 2: PART 2 CUE CARD */}
      {activeTab === 'part2' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Part 2 Cue Card Task</span>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedSet.part2CueCard.title}</h2>
            </div>

            <button
              onClick={() => onSelectSetForTest(selectedSet)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
              id="btn-practice-this-cue"
            >
              Practice This Cue Card Live
            </button>
          </div>

          <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 space-y-4">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">You should say:</p>
            <ul className="space-y-2 text-xs text-slate-800 pl-4 list-disc font-medium">
              {selectedSet.part2CueCard.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <div className="pt-3 border-t border-amber-200/60 text-xs text-amber-900">
              <span className="font-bold">Examiner Tip: </span>
              {selectedSet.part2CueCard.tips}
            </div>
          </div>

          {/* Model Answer for Part 2 */}
          {selectedSet.sampleModelAnswers?.find((m) => m.part === 2) && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-200">
                  Band 8.5 Full Monologue Model Answer
                </span>

                <button
                  onClick={() => {
                    const m = selectedSet.sampleModelAnswers?.find((item) => item.part === 2);
                    if (m) handleSpeakText(m.id, m.modelAnswer);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                  id="btn-speak-part2-model"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Full Cue Answer</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium italic">
                "{selectedSet.sampleModelAnswers?.find((m) => m.part === 2)?.modelAnswer}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENT TAB 3: TOPIC VOCABULARY BANK */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Band 8+ Collocations for <span className="text-rose-600">{selectedSet.title}</span>
            </h2>
            <span className="text-xs text-slate-500">Click any card to expand definition & example</span>
          </div>

          {selectedSet.relevantVocab && selectedSet.relevantVocab.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSet.relevantVocab.map((item, idx) => {
                const isExpanded = expandedVocabIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 hover:border-rose-300 transition-all cursor-pointer"
                    onClick={() => toggleVocab(idx)}
                    id={`card-vocab-${idx}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-base">{item.word}</span>
                        {item.phonetic && (
                          <span className="text-slate-400 text-xs font-mono">{item.phonetic}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md border border-rose-200">
                        {item.bandScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.definition}</p>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <p className="text-rose-700 font-bold">
                        Collocation: <span className="font-semibold text-slate-900">{item.collocation}</span>
                      </p>
                      <p className="text-slate-600 italic">"{item.exampleSentence}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No topic vocabulary items recorded for this set.</p>
          )}
        </div>
      )}
    </div>
  );
};
