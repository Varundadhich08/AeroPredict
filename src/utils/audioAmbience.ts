/**
 * Procedural Web Audio API Sound Generator for Airport & Aviation Ambience
 * Zero external audio dependencies - 100% self-contained & pure Web Audio.
 */

class AirportAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private engineGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private oscillatorLow: OscillatorNode | null = null;
  private oscillatorSub: OscillatorNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    } catch {
      console.warn('Web Audio API not supported on this platform');
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (!this.ctx) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startEngineAmbience();
      this.playAirportChime();
    } else {
      this.stopEngineAmbience();
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startEngineAmbience() {
    if (!this.ctx || this.isMuted) return;

    try {
      // 1. Gentle Jet Engine Low Hum (Oscillators)
      this.oscillatorLow = this.ctx.createOscillator();
      this.oscillatorLow.type = 'sawtooth';
      this.oscillatorLow.frequency.setValueAtTime(68, this.ctx.currentTime); // low 68Hz jet rumble

      this.oscillatorSub = this.ctx.createOscillator();
      this.oscillatorSub.type = 'sine';
      this.oscillatorSub.frequency.setValueAtTime(42, this.ctx.currentTime); // 42Hz sub rumble

      // Low pass filter to remove harshness
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // subtle background level

      this.oscillatorLow.connect(filter);
      this.oscillatorSub.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.oscillatorLow.start();
      this.oscillatorSub.start();
    } catch (e) {
      console.error('Audio engine start error', e);
    }
  }

  public stopEngineAmbience() {
    try {
      if (this.oscillatorLow) {
        this.oscillatorLow.stop();
        this.oscillatorLow.disconnect();
        this.oscillatorLow = null;
      }
      if (this.oscillatorSub) {
        this.oscillatorSub.stop();
        this.oscillatorSub.disconnect();
        this.oscillatorSub = null;
      }
      if (this.engineGain) {
        this.engineGain.disconnect();
        this.engineGain = null;
      }
    } catch {
      // Ignore cleanup error
    }
  }

  /**
   * Signature International Airport Chime (Ding-Dong: F# -> D#)
   */
  public playAirportChime() {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // First Tone (740 Hz - F#5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(739.99, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Second Tone (622 Hz - D#5) with a slight delay
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(622.25, now + 0.35);
      gain2.gain.setValueAtTime(0.12, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.8);
    } catch (e) {
      console.warn('Chime playback error', e);
    }
  }

  /**
   * Sound effect when prediction ML pipeline finishes (Takeoff throttle sound)
   */
  public playPredictionSuccessSound() {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5); // Spool up pitch
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // ignore
    }
  }
}

export const airportAudio = new AirportAudioEngine();
