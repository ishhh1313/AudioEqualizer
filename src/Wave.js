import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import town from "./town-10169.mp3";

function Wave() {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [midValue, setMidValue] = useState(0);
  const [bassValue, setBassValue] = useState(0);
  const [trebleValue, setTrebleValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRate, setAudioRate] = useState(1);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      backend: "WebAudio", 
    });
    wavesurfer.current.load(town);

    return () => {
      wavesurfer.current.destroy();
    };
  }, []);

  const updateEqualizer = () => {
    const audioContext = wavesurfer.current.backend.ac;
    const source = wavesurfer.current.backend.source;

    if (audioContext && source) {
      const eqNode1 = audioContext.createBiquadFilter();
      const eqNode2 = audioContext.createBiquadFilter();
      const eqNode3 = audioContext.createBiquadFilter();

      eqNode1.type = "peaking";
      eqNode1.frequency.value = 1000;
      eqNode1.gain.value = midValue;

      eqNode2.type = "lowshelf";
      eqNode2.frequency.value = 100;
      eqNode2.gain.value = bassValue;

      eqNode3.type = "highshelf";
      eqNode3.frequency.value = 8000;
      eqNode3.gain.value = trebleValue;

      source.disconnect();
      source.connect(eqNode1);
      eqNode1.connect(eqNode2);
      eqNode2.connect(eqNode3);
      eqNode3.connect(audioContext.destination);
    }
  };

  const handleMidChange = (event) => {
    const value = parseInt(event.target.value);
    setMidValue(value);
  };

  const handleBassChange = (event) => {
    const value = parseInt(event.target.value);
    setBassValue(value);
  };

  const handleTrebleChange = (event) => {
    const value = parseInt(event.target.value);
    setTrebleValue(value);
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      wavesurfer.current.loadBlob(file);
    }
  };
  

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
  };

  const handleAudioRateChange = (event) => {
    const value = parseFloat(event.target.value);
    setAudioRate(value);
    wavesurfer.current.setPlaybackRate(value); 
  };

  useEffect(() => {
    updateEqualizer();
  }, [midValue, bassValue, trebleValue]);

  return (
    <div>
      <h2>Waveform Example</h2>
      <div ref={waveformRef} />
      <div>
        <label htmlFor="mid">Mid:</label>
        <input
          type="range"
          id="mid"
          min="-40"
          max="40"
          value={midValue}
          onChange={handleMidChange}
        />
      </div>
      <div>
        <label htmlFor="bass">Bass:</label>
        <input
          type="range"
          id="bass"
          min="-40"
          max="40"
          value={bassValue}
          onChange={handleBassChange}
        />
      </div>
      <div>
        <label htmlFor="treble">Treble:</label>
        <input
          type="range"
          id="treble"
          min="-40"
          max="40"
          value={trebleValue}
          onChange={handleTrebleChange}
        />
      </div>
      <div>
        <label htmlFor="audioRate">Audio Rate:</label>
        <input
          type="number"
          id="audioRate"
          min="0.5"
          max="3 "
          step="0.1"
          value={audioRate}
          onChange={handleAudioRateChange}
        />
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileSelect} />
      </div>
      <button onClick={handlePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

export default Wave;
