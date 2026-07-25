/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, PageId } from './components/NavigationTabs';
import { CourseOverviewPage } from './components/CourseOverviewPage';
import { TestStepPart1 } from './components/TestStepPart1';
import { TestStepPart2 } from './components/TestStepPart2';
import { TestStepPart3 } from './components/TestStepPart3';
import { ResultsPage } from './components/ResultsPage';
import { QuestionBankPage } from './components/QuestionBankPage';
import { BandDescriptorsPage } from './components/BandDescriptorsPage';
import { FeaturesLabPage } from './components/FeaturesLabPage';
import { IELTSSet, AnswerTranscript, EvaluationResult, TestPart } from './types';
import { SAMPLE_IELTS_SETS } from './data/ieltsTopics';
import { createFallbackEvaluation } from './utils/fallbackEvaluation';
import { Loader2, Sparkles, Award } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [currentPart, setCurrentPart] = useState<TestPart | 'evaluating'>('home');
  const [selectedSet, setSelectedSet] = useState<IELTSSet>(SAMPLE_IELTS_SETS[0]);
  const [examinerVoiceEnabled, setExaminerVoiceEnabled] = useState<boolean>(true);

  // Accumulate transcripts
  const [transcripts, setTranscripts] = useState<AnswerTranscript[]>([]);
  const [part2Speech, setPart2Speech] = useState<string>('');
  const [candidateNotes, setCandidateNotes] = useState<string>('');

  // Evaluation results
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleStartTest = (set: IELTSSet) => {
    setSelectedSet(set);
    setTranscripts([]);
    setPart2Speech('');
    setCandidateNotes('');
    setEvaluation(null);
    setCurrentPart('part1');
    setActivePage('test');
  };

  const handleRestartTest = () => {
    if (
      currentPart !== 'home' &&
      currentPart !== 'results' &&
      !window.confirm('Are you sure you want to restart the IELTS test? Your current responses will be reset.')
    ) {
      return;
    }
    setTranscripts([]);
    setPart2Speech('');
    setCandidateNotes('');
    setEvaluation(null);
    setCurrentPart('home');
    setActivePage('home');
  };

  const handlePart1Complete = (part1Transcripts: AnswerTranscript[]) => {
    setTranscripts(part1Transcripts);
    setCurrentPart('part2_prep');
  };

  const handlePart2Complete = (part2Transcript: AnswerTranscript, notes: string) => {
    setCandidateNotes(notes);
    setPart2Speech(part2Transcript.userSpeech);
    const updatedTranscripts = [...transcripts, part2Transcript];
    setTranscripts(updatedTranscripts);
    setCurrentPart('part3');
  };

  const handlePart3Complete = async (part3Transcripts: AnswerTranscript[]) => {
    const fullTranscripts = [...transcripts, ...part3Transcripts];
    setTranscripts(fullTranscripts);
    setCurrentPart('evaluating');

    try {
      const response = await fetch('/api/evaluate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcripts: fullTranscripts,
          cueCard: selectedSet.part2CueCard,
        }),
      });

      const data = await response.json();
      if (data && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setEvaluation(createFallbackEvaluation(fullTranscripts, selectedSet));
      }
    } catch (err) {
      console.error('Failed to evaluate IELTS test:', err);
      setEvaluation(createFallbackEvaluation(fullTranscripts, selectedSet));
    } finally {
      setCurrentPart('results');
    }
  };

  const isTestActive = currentPart !== 'home' && currentPart !== 'results';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900">
      <Header
        currentPart={currentPart === 'evaluating' ? 'part3' : currentPart}
        examinerVoiceEnabled={examinerVoiceEnabled}
        onToggleExaminerVoice={() => setExaminerVoiceEnabled(!examinerVoiceEnabled)}
        onRestartTest={handleRestartTest}
        onGoHome={() => {
          setActivePage('home');
          if (currentPart === 'results') {
            setCurrentPart('home');
          }
        }}
      />

      <NavigationTabs
        activePage={activePage}
        onSelectPage={(page) => {
          setActivePage(page);
          if (page === 'test' && currentPart === 'home') {
            handleStartTest(selectedSet);
          }
        }}
        isTestInProgress={isTestActive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PAGE 1: COURSE OVERVIEW & WHY AI ACADEMY */}
        {activePage === 'home' && (
          <CourseOverviewPage
            onStartTest={handleStartTest}
            onNavigatePage={(pageId) => setActivePage(pageId)}
          />
        )}

        {/* PAGE 2: FULL IELTS PRACTICE TEST SIMULATION */}
        {activePage === 'test' && (
          <>
            {currentPart === 'home' && (
              <CourseOverviewPage
                onStartTest={handleStartTest}
                onNavigatePage={(pageId) => setActivePage(pageId)}
              />
            )}

            {currentPart === 'part1' && (
              <TestStepPart1
                questions={selectedSet.part1Questions}
                examinerVoiceEnabled={examinerVoiceEnabled}
                onPart1Complete={handlePart1Complete}
              />
            )}

            {(currentPart === 'part2_prep' || currentPart === 'part2_speak') && (
              <TestStepPart2
                cueCard={selectedSet.part2CueCard}
                examinerVoiceEnabled={examinerVoiceEnabled}
                onPart2Complete={handlePart2Complete}
              />
            )}

            {currentPart === 'part3' && (
              <TestStepPart3
                cueCard={selectedSet.part2CueCard}
                part2Speech={part2Speech}
                examinerVoiceEnabled={examinerVoiceEnabled}
                onPart3Complete={handlePart3Complete}
              />
            )}

            {currentPart === 'evaluating' && (
              <div className="max-w-xl mx-auto my-16 bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                  <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-500" /> AI Academy Band Score Analysis
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">Evaluating Your IELTS Speaking Test</h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    MZ IELTS Speaking Partner is analyzing your Fluency, Lexical Resource, Grammatical Accuracy, and Pronunciation across all 3 test parts...
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                    <Award className="w-4 h-4" />
                    <span>Checking Band Descriptors:</span>
                  </div>
                  <ul className="space-y-1 pl-6 list-disc font-medium text-slate-700">
                    <li>Grammatical sentence complexity & verb tense control</li>
                    <li>Idiomatic collocations & advanced academic vocabulary</li>
                    <li>Topic coherence & discourse connector placement</li>
                  </ul>
                </div>
              </div>
            )}

            {currentPart === 'results' && (
              <ResultsPage
                evaluation={evaluation || createFallbackEvaluation(transcripts, selectedSet)}
                transcripts={transcripts}
                cueCard={selectedSet.part2CueCard}
                candidateNotes={candidateNotes}
                onRetakeTest={() => handleStartTest(selectedSet)}
              />
            )}
          </>
        )}

        {/* PAGE 3: QUESTION & VOCABULARY BANK */}
        {activePage === 'study_bank' && (
          <QuestionBankPage onSelectSetForTest={handleStartTest} />
        )}

        {/* PAGE 4: BAND DESCRIPTORS & CRITERIA GUIDE */}
        {activePage === 'criteria_guide' && <BandDescriptorsPage />}

        {/* PAGE 5: INTERACTIVE FEATURES LAB */}
        {activePage === 'features_lab' && <FeaturesLabPage />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">MZ IELTS Speaking Partner</span>
            <span>•</span>
            <span>AI Academy</span>
          </div>
          <p>© {new Date().getFullYear()} MZ IELTS. Built for IELTS candidates worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
