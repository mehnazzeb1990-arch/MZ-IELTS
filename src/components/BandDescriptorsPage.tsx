import React, { useState } from 'react';
import { Award, CheckCircle2, Volume2, Sparkles, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

export const BandDescriptorsPage: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<number>(8);
  const [speakingTip, setSpeakingTip] = useState<string | null>(null);

  const bandData: Record<number, {
    title: string;
    summary: string;
    fluency: string[];
    lexical: string[];
    grammar: string[];
    pronunciation: string[];
    examinerAdvice: string;
    modelAudioText: string;
  }> = {
    9: {
      title: 'Band 9 • Expert User',
      summary: 'Speaks fluently with only rare repetition or self-correction; develops topics fully and appropriately; uses vocabulary idiomatically and precisely.',
      fluency: [
        'Speaks fluently with only rare hesitation, self-correction, or repetition.',
        'Hesitation is purely content-related rather than searching for language.',
        'Develops topics fully and coherently with seamless discourse markers.',
      ],
      lexical: [
        'Uses vocabulary with full flexibility and precision in all topics.',
        'Uses idiomatic language and rare collocations naturally and accurately.',
      ],
      grammar: [
        'Uses a full range of structures naturally and appropriately.',
        'Produces consistently accurate structures with rare minor slips.',
      ],
      pronunciation: [
        'Uses a full range of pronunciation features with precision and subtlety.',
        'Sustains flexible use of features throughout, effortless to understand.',
      ],
      examinerAdvice: 'To achieve Band 9, ensure your speech sounds entirely effortless, naturally rhythmic, and filled with highly precise collocations.',
      modelAudioText: 'I strongly believe that artificial intelligence will not replace human creativity, but rather augment our capacity to synthesize complex ideas.',
    },
    8: {
      title: 'Band 8 • Very Good User',
      summary: 'Speaks fluently with only occasional repetition or self-correction; uses a wide vocabulary resource readily and flexibly to convey precise meaning.',
      fluency: [
        'Speaks fluently with only occasional repetition or self-correction.',
        'Develops topics coherently and appropriately without losing sequence.',
        'Hesitation is usually for ideas rather than vocabulary search.',
      ],
      lexical: [
        'Uses a wide vocabulary resource readily and flexibly to convey precise meaning.',
        'Uses less common and idiomatic vocabulary skillfully with rare inaccuracies.',
        'Paraphrases effectively as required.',
      ],
      grammar: [
        'Uses a wide range of flexible sentence structures.',
        'Majority of sentences are error-free with only occasional minor non-systematic errors.',
      ],
      pronunciation: [
        'Uses a wide range of pronunciation features smoothly.',
        'Sustains flexible feature usage; easy to understand with clear stress & intonation.',
      ],
      examinerAdvice: 'For Band 8, expand your use of complex compound sentences and ensure less common collocations flow naturally into your speech.',
      modelAudioText: 'While living in a bustling metropolis offers undeniable convenience, it can occasionally feel overwhelming due to the fast-paced lifestyle.',
    },
    7: {
      title: 'Band 7 • Good User',
      summary: 'Speaks at length without noticeable effort or loss of coherence; uses vocabulary flexibly with some idiomatic collocations.',
      fluency: [
        'Speaks at length without noticeable effort or loss of coherence.',
        'May demonstrate language-related hesitation or repetition at times.',
        'Uses a range of connectives and discourse markers flexibly.',
      ],
      lexical: [
        'Uses vocabulary resource flexibly to discuss a variety of topics.',
        'Uses some less common and idiomatic vocabulary with awareness of style.',
        'Shows ability to paraphrase effectively.',
      ],
      grammar: [
        'Uses a range of complex structures with reasonable flexibility.',
        'Frequently produces error-free sentences, though some grammatical mistakes persist.',
      ],
      pronunciation: [
        'Shows all positive features of Band 6 and some features of Band 8.',
        'Can generally be understood throughout with clear rhythm.',
      ],
      examinerAdvice: 'To jump from Band 6 to Band 7, reduce fillers like "um" and "uh", and actively incorporate complex conditional sentences.',
      modelAudioText: 'If I had more leisure time, I would definitely pursue outdoor activities like hiking and photography to unwind from work.',
    },
    6: {
      title: 'Band 6 • Competent User',
      summary: 'Willing to speak at length, though may lose coherence at times due to hesitation, repetition, or self-correction.',
      fluency: [
        'Willing to speak at length, though may lose coherence through hesitation.',
        'Uses a range of connectives, but not always appropriately.',
      ],
      lexical: [
        'Has a wide enough vocabulary to discuss topics at length.',
        'Generally paraphrases successfully, though with some inaccuracies.',
      ],
      grammar: [
        'Uses a mix of simple and complex structures, but with limited flexibility.',
        'May make frequent mistakes with complex structures, though these rarely impede comprehension.',
      ],
      pronunciation: [
        'Uses a range of pronunciation features with mixed control.',
        'Can generally be understood throughout, though mispronunciation of individual words occurs.',
      ],
      examinerAdvice: 'Focus on eliminating simple tense errors (e.g., third-person -s, past tense endings) and expanding basic vocabulary into collocations.',
      modelAudioText: 'I like my hometown because it has many parks and nice restaurants, although sometimes traffic is very busy in the morning.',
    },
    5: {
      title: 'Band 5 • Modest User',
      summary: 'Usually maintains flow of speech but uses repetition, self-correction, or slow speech to keep going.',
      fluency: [
        'Maintains flow of speech, but uses slow speed and repetition.',
        'Overuses certain connectives and simple conjunctions.',
      ],
      lexical: [
        'Manages to talk about familiar topics, but uses limited vocabulary flexibility.',
        'Rarely attempts paraphrasing.',
      ],
      grammar: [
        'Produces basic sentence forms with reasonable accuracy.',
        'Complex structures are limited and frequently contain errors.',
      ],
      pronunciation: [
        'Shows mispronunciations that cause difficulty for the listener.',
      ],
      examinerAdvice: 'Build confidence in basic tenses and expand your vocabulary beyond single-word answers.',
      modelAudioText: 'My hometown is small city. I live there with my family and I work in office.',
    },
  };

  const currentInfo = bandData[selectedBand];

  const handleSpeakModelText = (text: string) => {
    if (speakingTip === text) {
      stopSpeaking();
      setSpeakingTip(null);
    } else {
      stopSpeaking();
      setSpeakingTip(text);
      speakText(
        text,
        () => setSpeakingTip(text),
        () => setSpeakingTip(null),
        1.0
      );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HERO BANNER */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-8 shadow-2xl border border-rose-900/40 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-xs font-bold">
          <Award className="w-4 h-4 text-orange-400" />
          <span>Official Public Band Descriptors</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          IELTS Speaking Band 5 – 9 Evaluation Guide
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Select a target Band level below to examine the exact criteria our AI Examiner uses to score Fluency, Lexical Resource, Grammar, and Pronunciation.
        </p>

        {/* BAND SELECTOR BUTTONS */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          {[9, 8, 7, 6, 5].map((band) => (
            <button
              key={band}
              onClick={() => setSelectedBand(band)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedBand === band
                  ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg ring-2 ring-rose-400/50 scale-105'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
              id={`btn-select-band-${band}`}
            >
              Band {band}.0
            </button>
          ))}
        </div>
      </section>

      {/* BAND SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Selected Descriptor
            </span>
            <h2 className="text-2xl font-black text-slate-900">{currentInfo.title}</h2>
          </div>

          <button
            onClick={() => handleSpeakModelText(currentInfo.modelAudioText)}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              speakingTip === currentInfo.modelAudioText
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            id="btn-speak-band-sample"
          >
            <Volume2 className="w-4 h-4 text-orange-500" />
            <span>{speakingTip === currentInfo.modelAudioText ? 'Stop Voice' : `Listen Band ${selectedBand} Sample`}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium leading-relaxed">
          "{currentInfo.summary}"
        </p>

        {/* 4 CRITERIA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FC */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center text-rose-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-rose-600" />
              1. Fluency & Coherence (FC)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 pl-2">
              {currentInfo.fluency.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-rose-500 mr-2 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center text-orange-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-orange-600" />
              2. Lexical Resource (LR)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 pl-2">
              {currentInfo.lexical.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-orange-500 mr-2 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GRA */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center text-amber-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-amber-600" />
              3. Grammatical Range & Accuracy (GRA)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 pl-2">
              {currentInfo.grammar.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-amber-500 mr-2 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              4. Pronunciation (PR)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 pl-2">
              {currentInfo.pronunciation.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-emerald-500 mr-2 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* EXAMINER TARGET ADVICE BOX */}
        <div className="bg-rose-950 text-white p-6 rounded-2xl border border-rose-800 space-y-2">
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Examiner Advice for Band {selectedBand}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {currentInfo.examinerAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};
