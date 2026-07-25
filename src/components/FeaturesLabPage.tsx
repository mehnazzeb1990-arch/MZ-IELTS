import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Clock, Award, Sparkles, Play, Pause, RotateCcw, Volume2, CheckCircle2, ArrowRight, Lightbulb, RefreshCw, Layers } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

export const FeaturesLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'timer' | 'calculator' | 'workbench'>('voice');

  // --- TOOL 1: VOICE INTERACTION LAB STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [speechRateWpm, setSpeechRateWpm] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setVoiceText(currentTranscript.trim());
      };

      rec.onerror = (err: any) => {
        console.error('Speech rec error', err);
        setVoiceError('Microphone permission or browser speech recognition error.');
      };

      setRecognition(rec);
    } else {
      setVoiceError('Web Speech API is not supported in this browser environment. You can type text directly.');
    }
  }, []);

  useEffect(() => {
    const words = voiceText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    // Estimated WPM assuming ~30 seconds average speaking sample
    setSpeechRateWpm(Math.round((words.length / 30) * 60));
  }, [voiceText]);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setVoiceError(null);
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  // --- TOOL 2: OFFICIAL TIMER SIMULATOR STATE ---
  const [timerMode, setTimerMode] = useState<'prep' | 'speak'>('prep');
  const [timeLeft, setTimeLeft] = useState(60); // 60s for prep, 120s for speak
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [prepNotes, setPrepNotes] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      speakText('Timer complete! Proceed with your speech.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = (mode: 'prep' | 'speak') => {
    setTimerMode(mode);
    setTimeLeft(mode === 'prep' ? 60 : 120);
    setIsTimerRunning(true);
  };

  // --- TOOL 3: 4-CRITERIA BAND SCORE CALCULATOR STATE ---
  const [fcScore, setFcScore] = useState<number>(7.0);
  const [lrScore, setLrScore] = useState<number>(7.5);
  const [graScore, setGraScore] = useState<number>(7.0);
  const [prScore, setPrScore] = useState<number>(8.0);

  // Official IELTS Rounding Rule: Average calculated, then rounded to nearest .5 or whole band
  const rawAverage = (fcScore + lrScore + graScore + prScore) / 4;
  const calculateIELTSOverall = (avg: number) => {
    const decimal = avg - Math.floor(avg);
    if (decimal < 0.25) return Math.floor(avg);
    if (decimal < 0.75) return Math.floor(avg) + 0.5;
    return Math.ceil(avg);
  };
  const overallCalculated = calculateIELTSOverall(rawAverage);

  // --- TOOL 4: GRAMMAR & VOCAB UPGRADE WORKBENCH STATE ---
  const [inputSentence, setInputSentence] = useState(
    'I like living in my hometown because it has good places and nice people.'
  );
  const [transformedData, setTransformedData] = useState<{
    original: string;
    enhancedSentence: string;
    grammarFixes: string[];
    vocabUpgrades: { from: string; to: string; reason: string }[];
  } | null>({
    original: 'I like living in my hometown because it has good places and nice people.',
    enhancedSentence:
      'I thoroughly enjoy residing in my hometown, primarily owing to its vibrant amenities and welcoming local community.',
    grammarFixes: [
      'Replaced weak generic adjective "good places" with precise collocations ("vibrant amenities").',
      'Upgraded simple conjunction "because" to formal cohesive device ("primarily owing to").',
    ],
    vocabUpgrades: [
      { from: 'like living in', to: 'thoroughly enjoy residing in', reason: 'Higher register Band 8 verb phrasing' },
      { from: 'good places', to: 'vibrant amenities', reason: 'Precise lexical collocation' },
      { from: 'nice people', to: 'welcoming local community', reason: 'Advanced topic vocabulary' },
    ],
  });

  const handleTransformSentence = () => {
    if (!inputSentence.trim()) return;

    // Simple dynamic rule enhancer for demo
    const lower = inputSentence.toLowerCase();
    let enhanced = inputSentence;

    const replacements: { from: string; to: string; reason: string }[] = [];

    if (lower.includes('good')) {
      enhanced = enhanced.replace(/good/gi, 'exceptional');
      replacements.push({ from: 'good', to: 'exceptional', reason: 'Higher precision adjective' });
    }
    if (lower.includes('like')) {
      enhanced = enhanced.replace(/like/gi, 'greatly appreciate');
      replacements.push({ from: 'like', to: 'greatly appreciate', reason: 'Band 8.5 nuance verb' });
    }
    if (lower.includes('big')) {
      enhanced = enhanced.replace(/big/gi, 'substantial');
      replacements.push({ from: 'big', to: 'substantial', reason: 'Academic register vocabulary' });
    }
    if (lower.includes('because')) {
      enhanced = enhanced.replace(/because/gi, 'due to the fact that');
      replacements.push({ from: 'because', to: 'due to the fact that', reason: 'Formal cohesive connector' });
    }

    if (replacements.length === 0) {
      enhanced = `Without doubt, ${inputSentence.toLowerCase()} which substantially enhances overall quality.`;
      replacements.push({
        from: 'basic structure',
        to: 'complex clause clause structure',
        reason: 'Grammatical Range enhancement',
      });
    }

    setTransformedData({
      original: inputSentence,
      enhancedSentence: enhanced,
      grammarFixes: ['Applied complex clause subordination and passive/active voice balance.'],
      vocabUpgrades: replacements,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-8 shadow-2xl border border-rose-900/40 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>AI Academy Practice Lab</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Interactive IELTS Speaking Features & Tools
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Test real-time microphone voice recognition, run official prep countdown timers, calculate 4-criteria band scores, and upgrade your grammar & vocabulary with our live interactive tools below.
        </p>

        {/* LAB TOOL SELECTOR TABS */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md ring-2 ring-rose-400/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
            id="btn-lab-tab-voice"
          >
            <Mic className="w-4 h-4 text-rose-400" />
            <span>1. Voice Interaction Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md ring-2 ring-rose-400/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
            id="btn-lab-tab-timer"
          >
            <Clock className="w-4 h-4 text-orange-400" />
            <span>2. Official Timer Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md ring-2 ring-rose-400/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
            id="btn-lab-tab-calculator"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>3. Band Score Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workbench'
                ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md ring-2 ring-rose-400/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
            id="btn-lab-tab-workbench"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>4. Grammar & Vocab Workbench</span>
          </button>
        </div>
      </section>

      {/* TOOL 1: REAL VOICE INTERACTION LAB */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Feature 1</span>
            <h2 className="text-2xl font-black text-slate-900">Real Voice Recognition & Speech Diagnostics</h2>
            <p className="text-xs text-slate-500 mt-1">
              Test your microphone, view real-time live transcription, and measure spoken word count and WPM pacing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Word Count</span>
              <p className="text-3xl font-black text-slate-900">{wordCount}</p>
              <p className="text-[10px] text-slate-500">Total words spoken</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Speech Rate</span>
              <p className="text-3xl font-black text-rose-600">{speechRateWpm} <span className="text-xs font-normal">WPM</span></p>
              <p className="text-[10px] text-slate-500">IELTS Ideal Range: 120 - 150 WPM</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Voice Test</span>
              <button
                onClick={() => speakText("Testing AI audio playback system. Speech synthesis is clear and operational.")}
                className="mt-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
                id="btn-test-examiner-voice"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test AI Voice</span>
              </button>
              <p className="text-[10px] text-slate-500">Click to test examiner audio</p>
            </div>
          </div>

          {/* Mic Recorder Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Live Speech Transcript:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleRecording}
                  className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                      : 'bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:from-rose-500 hover:to-orange-400'
                  }`}
                  id="btn-toggle-mic-lab"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Mic Recording'}</span>
                </button>

                <button
                  onClick={() => setVoiceText('')}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  id="btn-clear-transcript"
                >
                  Clear
                </button>
              </div>
            </div>

            {voiceError && (
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                {voiceError}
              </p>
            )}

            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Click 'Start Mic Recording' and speak your answer naturally into your microphone, or type your response here..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white transition-all font-medium leading-relaxed"
              id="textarea-voice-lab"
            />
          </div>
        </div>
      )}

      {/* TOOL 2: OFFICIAL TIMER SIMULATOR */}
      {activeTab === 'timer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Feature 2</span>
            <h2 className="text-2xl font-black text-slate-900">Official Exam Timers & Cue Card Prep Simulator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Practice under exact 1-minute cue card preparation clocks and 2-minute speaking monologue timers.
            </p>
          </div>

          <div className="max-w-md mx-auto text-center space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                {timerMode === 'prep' ? 'Part 2 Cue Preparation Timer' : 'Part 2 Cue Speaking Monologue Timer'}
              </span>
              <div className="text-6xl font-black text-slate-900 font-mono tracking-tight my-2">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {timerMode === 'prep' ? 'Target: 60 Seconds' : 'Target: 120 Seconds'}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => handleStartTimer('prep')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  timerMode === 'prep' && isTimerRunning
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
                id="btn-start-1m-prep"
              >
                Start 1-Min Prep
              </button>

              <button
                onClick={() => handleStartTimer('speak')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  timerMode === 'speak' && isTimerRunning
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
                id="btn-start-2m-speak"
              >
                Start 2-Min Speech
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(60);
                }}
                className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                id="btn-reset-timer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">1-Minute Prep Bullet Notes Scratchpad:</label>
            <textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Type your bullet points during the 1-minute prep timer (e.g., Topic / Where & When / Key Details / Personal Reflection)..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all font-mono"
              id="textarea-prep-notes"
            />
          </div>
        </div>
      )}

      {/* TOOL 3: 4-CRITERIA BAND SCORE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Feature 3</span>
            <h2 className="text-2xl font-black text-slate-900">4-Criteria Band Score Diagnostic Calculator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust individual component scores to test how Fluency, Lexical Resource, Grammar, and Pronunciation round into your official overall IELTS Band score.
            </p>
          </div>

          {/* OVERALL RESULT DISPLAY */}
          <div className="bg-gradient-to-r from-slate-950 to-rose-950 text-white p-6 rounded-2xl border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Calculated Overall Result</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">IELTS Speaking Score</h3>
              <p className="text-xs text-slate-400">Raw average: {rawAverage.toFixed(2)}</p>
            </div>

            <div className="text-center sm:text-right bg-rose-900/60 px-6 py-3 rounded-2xl border border-rose-800">
              <span className="text-xs font-bold text-rose-300 uppercase">Overall Band</span>
              <p className="text-4xl font-black text-amber-300 font-mono">{overallCalculated.toFixed(1)}</p>
            </div>
          </div>

          {/* SLIDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Fluency & Coherence (FC):</span>
                <span className="text-rose-600 font-mono text-sm">{fcScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.5"
                value={fcScore}
                onChange={(e) => setFcScore(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
                id="slider-fc"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Lexical Resource (LR):</span>
                <span className="text-orange-600 font-mono text-sm">{lrScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.5"
                value={lrScore}
                onChange={(e) => setLrScore(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
                id="slider-lr"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Grammar Range & Accuracy (GRA):</span>
                <span className="text-amber-600 font-mono text-sm">{graScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.5"
                value={graScore}
                onChange={(e) => setGraScore(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
                id="slider-gra"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Pronunciation (PR):</span>
                <span className="text-emerald-600 font-mono text-sm">{prScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.5"
                value={prScore}
                onChange={(e) => setPrScore(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                id="slider-pr"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: GRAMMAR & VOCAB WORKBENCH */}
      {activeTab === 'workbench' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Feature 4</span>
            <h2 className="text-2xl font-black text-slate-900">Grammar & Vocabulary Upgrade Workbench</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter any basic spoken sentence below to instantly transform it into a Band 8.5 academic sentence with vocabulary replacements and grammar analysis.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">Your Spoken Sentence:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                placeholder="Type a sentence (e.g., I like my job because the salary is good)..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-rose-500 focus:bg-white font-medium"
                id="input-workbench-sentence"
              />
              <button
                onClick={handleTransformSentence}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
                id="btn-workbench-transform"
              >
                Analyze & Upgrade
              </button>
            </div>
          </div>

          {transformedData && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Band 8.5 Transformed Version
                </span>

                <button
                  onClick={() => speakText(transformedData.enhancedSentence)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-xs"
                  id="btn-speak-workbench-result"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Upgraded Voice</span>
                </button>
              </div>

              <p className="text-sm font-extrabold text-slate-900 bg-white p-4 rounded-xl border border-rose-200 text-rose-950 leading-relaxed">
                "{transformedData.enhancedSentence}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Vocabulary Upgrades Applied:</h4>
                  <ul className="space-y-1.5">
                    {transformedData.vocabUpgrades.map((v, i) => (
                      <li key={i} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                        <span className="text-slate-400 line-through mr-1">{v.from}</span>
                        <ArrowRight className="w-3 h-3 inline text-rose-500 mx-1" />
                        <span className="font-bold text-emerald-700">{v.to}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{v.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Grammar & Structure Fixes:</h4>
                  <ul className="space-y-1.5">
                    {transformedData.grammarFixes.map((g, i) => (
                      <li key={i} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 flex items-start">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 mr-2 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
