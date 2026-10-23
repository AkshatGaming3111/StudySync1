/**
 * StudySync AI Educational Suite - Web Audio Ambient Soundscape Engine
 * Pure synthesized audio via Web Audio API (Zero external audio file dependencies)
 */

class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.currentMode = null;
    this.nodes = [];
    this.gainNode = null;
    this.volume = 0.5;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  stop() {
    if (this.nodes.length > 0) {
      this.nodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.nodes = [];
    }
    this.isPlaying = false;
    this.currentMode = null;
  }

  playRain() {
    this.init();
    this.stop();
    this.currentMode = 'rain';
    this.isPlaying = true;

    // Pink / Brown noise buffer for rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.nodes.push(noise, filter);
  }

  playWhiteNoise() {
    this.init();
    this.stop();
    this.currentMode = 'whitenoise';
    this.isPlaying = true;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.nodes.push(noise, filter);
  }

  playBinauralBeats() {
    this.init();
    this.stop();
    this.currentMode = 'binaural';
    this.isPlaying = true;

    // 40Hz Gamma frequency focus beats (200Hz left, 240Hz right)
    const baseFreq = 210;
    const diff = 14; // 14Hz Alpha/Beta focus rhythm

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(baseFreq + diff, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);

    const softGain = this.ctx.createGain();
    softGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    merger.connect(softGain);
    softGain.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.nodes.push(oscLeft, oscRight, merger, softGain);
  }

  playLofiDrone() {
    this.init();
    this.stop();
    this.currentMode = 'lofi';
    this.isPlaying = true;

    // Warm ambient chords
    const chordFrequencies = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3 (Cmaj7)
    
    chordFrequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(subGain);
      subGain.connect(this.gainNode);

      osc.start();
      this.nodes.push(osc, filter, subGain);
    });
  }

  playChime(type = 'success') {
    this.init();
    const osc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    const freq = type === 'launch' ? 587.33 : 880; // D5 or A5
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.15);

    chimeGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(chimeGain);
    chimeGain.connect(this.gainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }
}

window.soundEngine = new AmbientSoundEngine();
