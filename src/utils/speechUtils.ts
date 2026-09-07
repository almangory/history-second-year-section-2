/**
 * Arabic Text-to-Speech Engine for Sudan Grade 6 History Lessons
 * Supports speech synthesis, pause/resume, custom rates, and voice selection.
 */

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private isPausedState: boolean = false;
  private listeners: ((speaking: boolean, paused: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public subscribe(listener: (speaking: boolean, paused: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeakingState, this.isPausedState));
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/[*#_~`>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/١|٢|٣|٤|٥|٦|٧|٨|٩|٠/g, (d) => {
        const arNums: Record<string, string> = {
          "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5",
          "٦": "6", "٧": "7", "٨": "8", "٩": "9", "٠": "0"
        };
        return arNums[d] || d;
      })
      .trim();
  }

  public speak(text: string, rate: number = 0.95, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    const cleanText = this.sanitizeText(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith("ar") || v.name.includes("Arabic") || v.name.includes("عربي")
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeakingState && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      isSupported: this.isSupported()
    };
  }
}

export const speechEngine = new SpeechEngine();
