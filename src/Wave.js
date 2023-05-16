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

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      backend: "WebAudio", // Use Web Audio backend for audio manipulation
    });

    // Load audio file
    wavesurfer.current.load(town);

    return () => {
      wavesurfer.current.destroy();
    };
  }, []);

  // Function to update the equalizer settings
  const updateEqualizer = () => {
    const audioContext = wavesurfer.current.backend.getAudioContext();
    const source = wavesurfer.current.backend.source;

    // Create the equalizer nodes
    if (audioContext && source) {
      // Create the equalizer nodes
      const eqNode1 = audioContext.createBiquadFilter();
      const eqNode2 = audioContext.createBiquadFilter();
      const eqNode3 = audioContext.createBiquadFilter();

      // Configure the equalizer nodes
      eqNode1.type = "peaking";
      eqNode1.frequency.value = 1000;
      eqNode1.gain.value = midValue;

      eqNode2.type = "lowshelf";
      eqNode2.frequency.value = 100;
      eqNode2.gain.value = bassValue;

      eqNode3.type = "highshelf";
      eqNode3.frequency.value = 8000;
      eqNode3.gain.value = trebleValue;

      // Connect the nodes
      source.disconnect();
      source.connect(eqNode1);
      eqNode1.connect(eqNode2);
      eqNode2.connect(eqNode3);
      eqNode3.connect(audioContext.destination);
    }
    // Connect the nodes
  };

  // Event handler for mid input change
  const handleMidChange = (event) => {
    const value = parseInt(event.target.value);
    setMidValue(value);
  };

  // Event handler for bass input change
  const handleBassChange = (event) => {
    const value = parseInt(event.target.value);
    setBassValue(value);
  };

  // Event handler for treble input change
  const handleTrebleChange = (event) => {
    const value = parseInt(event.target.value);
    setTrebleValue(value);
  };

  // Event handler for play button click
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
  };

  useEffect(() => {
    // Update the equalizer settings when mid, bass, or treble values change
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

      <button onClick={handlePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}
export default Wave;
