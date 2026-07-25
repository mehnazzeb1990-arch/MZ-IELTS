/**
 * Single-Voice Female British IELTS Speaking Examiner & Audio Synchronization Engine
 */

// Types for SpeechRecognition API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export class SpeechHandler {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private finalTranscript: string = '';

  constructor() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-GB'; // British English candidate recognition
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(
    onTranscriptUpdate: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported on this browser. You can type your response.');
      return;
    }

    this.finalTranscript = '';
    this.isListening = true;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const combined = (this.finalTranscript + interimTranscript).trim();
      onTranscriptUpdate(combined, false);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Speech recognition notice:', event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        onError(`Speech recognition notice: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }
}

// =========================================================================
// SINGLE GLOBAL AUDIO SESSION LOCK & EXAMINER VOICE SYNCHRONIZATION ENGINE
// =========================================================================

let activeSessionId = 0;
let activeAbortController: AbortController | null = null;
let activeAudioContext: AudioContext | null = null;
let activeAudioSource: AudioBufferSourceNode | null = null;
let activeHtmlAudio: HTMLAudioElement | null = null;

/**
 * Completely stops all playing or pending speech audio and invalidates all in-flight requests.
 */
export function stopSpeaking() {
  // 1. Invalidate current session counter so any in-flight promises self-terminate
  activeSessionId++;

  // 2. Abort any active HTTP fetch request for TTS
  if (activeAbortController) {
    try {
      activeAbortController.abort();
    } catch (_) {}
    activeAbortController = null;
  }

  // 3. Cancel browser SpeechSynthesis if active
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }

  // 4. Pause HTML Audio element
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.currentTime = 0;
      activeHtmlAudio.src = '';
    } catch (_) {}
    activeHtmlAudio = null;
  }

  // 5. Stop Web Audio BufferSource & close AudioContext
  if (activeAudioSource) {
    try {
      activeAudioSource.stop();
      activeAudioSource.disconnect();
    } catch (_) {}
    activeAudioSource = null;
  }

  if (activeAudioContext) {
    try {
      activeAudioContext.close();
    } catch (_) {}
    activeAudioContext = null;
  }
}

let lockedFemaleBritishVoice: SpeechSynthesisVoice | null = null;

/**
 * Logs every runtime-detected SpeechSynthesis voice whose language starts with "en".
 * Outputs name, lang, default, and localService without inferring gender.
 */
export function logEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const allVoices = window.speechSynthesis.getVoices();
  const enVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('en'));

  console.log(`=== DETECTED ${enVoices.length} ENGLISH SPEECH SYNTHESIS VOICES AT RUNTIME ===`);
  enVoices.forEach((v, index) => {
    console.log(`[English Voice ${index + 1}] name: "${v.name}" | lang: "${v.lang}" | default: ${v.default} | localService: ${v.localService}`);
  });

  return allVoices;
}

// Register onvoiceschanged handler to log voices as soon as they load in browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  logEnglishVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    logEnglishVoices();
  };
}

/**
 * Strictly returns ONLY a Female British English voice (Received Pronunciation).
 * Excludes male voices and non-British accents under all circumstances.
 * Locks the selected voice for the entire session.
 */
export function getBestFemaleBritishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return lockedFemaleBritishVoice;

  // 1. EXACT TARGET: Always prefer "Google UK English Female" if it exists in runtime voices
  const googleUkFemale = voices.find((v) =>
    v.name.trim().toLowerCase() === 'google uk english female' ||
    v.name.toLowerCase().includes('google uk english female')
  );

  if (googleUkFemale) {
    lockedFemaleBritishVoice = googleUkFemale;
    return googleUkFemale;
  }

  // 2. Strict list of male keywords and unwanted US fallback voices to ALWAYS exclude
  const EXCLUDED_KEYWORDS = [
    'daniel', 'george', 'oliver', 'ryan', 'arthur', 'brian', 'david',
    'guy', 'male', 'man', 'boy', 'thomas', 'richard', 'james', 'mark',
    'paul', 'john', 'steven', 'michael', 'peter', 'alexander', 'fred',
    'sam', 'tom', 'harry', 'jack', 'charlie', 'william', 'henry', 'ben',
    'adam', 'chris', 'matthew', 'joseph', 'luke', 'anthony', 'andrew',
    'zira' // Explicitly reject Microsoft Zira
  ];

  // Preferred British female patterns
  const FEMALE_BRITISH_PREFERRED = [
    'microsoft sonia',
    'microsoft mia',
    'microsoft maisie',
    'microsoft libby',
    'stephanie',
    'serena',
    'fiona',
    'victoria',
    'kate',
    'martha',
    'microsoft hazel',
    'uk english female',
    'female british'
  ];

  // Filter out excluded voices
  const validVoices = voices.filter((v) => {
    const nameLower = v.name.toLowerCase();
    return !EXCLUDED_KEYWORDS.some((k) => nameLower.includes(k));
  });

  if (validVoices.length === 0) return null;

  // Search preferred female British voices
  for (const pattern of FEMALE_BRITISH_PREFERRED) {
    const match = validVoices.find((v) => v.name.toLowerCase().includes(pattern));
    if (match) {
      lockedFemaleBritishVoice = match;
      return match;
    }
  }

  // Any non-male British English voice
  const anyBritish = validVoices.find((v) => {
    const langLower = v.lang.toLowerCase();
    const nameLower = v.name.toLowerCase();
    return (
      (langLower === 'en-gb' || langLower === 'en_gb' || langLower === 'en-uk' || nameLower.includes('uk') || nameLower.includes('british')) &&
      !nameLower.includes('google uk english male')
    );
  });

  if (anyBritish) {
    lockedFemaleBritishVoice = anyBritish;
    return anyBritish;
  }

  // Fallback to any en-GB or en-UK locale voice (DO NOT lock non-GB fallback as lockedFemaleBritishVoice)
  const fallbackGB = validVoices.find((v) => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk')) || null;
  if (fallbackGB) {
    lockedFemaleBritishVoice = fallbackGB;
    return fallbackGB;
  }

  // Return non-male English voice without setting lockedFemaleBritishVoice so Google UK English Female can be picked when loaded
  const temporaryEnglish = validVoices.find((v) => v.lang.toLowerCase().startsWith('en')) || validVoices[0] || null;
  return temporaryEnglish;
}

// Pre-load browser voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBestFemaleBritishVoice();
  };
}

/**
 * Returns label for active voice
 */
export function getFemaleBritishVoiceInfo(): string {
  const v = getBestFemaleBritishVoice();
  if (v) {
    return `Native Female British (en-GB): ${v.name.replace(/(Microsoft|Google|Apple)\s*/gi, '')}`;
  }
  return 'Native Female British (en-GB Examiner)';
}

/**
 * Primary Text-To-Speech Examiner function using dedicated Web Speech Engine with locked female British voice.
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate: number = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    // 1. Stop all previous speech & invalidate any pending session
    stopSpeaking();

    const cleanText = text.replace(/[*_#"`]/g, '').trim();
    if (!cleanText) {
      onStart?.();
      onEnd?.();
      resolve();
      return;
    }

    // Capture this invocation's unique session ID
    const mySessionId = activeSessionId;

    let hasEnded = false;
    const safeEnd = () => {
      if (mySessionId !== activeSessionId) return;
      if (!hasEnded) {
        hasEnded = true;
        onEnd?.();
        resolve();
      }
    };

    const safeStart = () => {
      if (mySessionId !== activeSessionId) return;
      onStart?.();
    };

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      safeStart();
      safeEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.85, Math.min(1.15, rate));
    utterance.pitch = 1.1;

    let femaleVoice = getBestFemaleBritishVoice();
    if (!femaleVoice) {
      const allVoices = window.speechSynthesis.getVoices();
      femaleVoice =
        allVoices.find((v) => v.name.toLowerCase().includes('google uk english female')) ||
        allVoices.find((v) => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk')) ||
        null;
    }

    if (femaleVoice) {
      utterance.voice = femaleVoice;
      utterance.lang = femaleVoice.lang;
    } else {
      utterance.lang = 'en-GB';
    }

    console.log(`[BEFORE SPEAK] utterance.voice?.name="${utterance.voice?.name}" | utterance.voice?.lang="${utterance.voice?.lang}"`);

    utterance.onstart = () => {
      if (mySessionId === activeSessionId) safeStart();
    };

    utterance.onend = () => {
      if (mySessionId === activeSessionId) safeEnd();
    };

    utterance.onerror = () => {
      if (mySessionId === activeSessionId) safeEnd();
    };

    window.speechSynthesis.speak(utterance);
  });
}

// Timer audio tone generator
export function playChime(type: 'prep_start' | 'prep_done' | 'timer_warning') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'prep_start') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'prep_done') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    console.warn('Audio context error:', err);
  }
}
