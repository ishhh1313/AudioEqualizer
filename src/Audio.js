
import FFMPEG from "react-ffmpeg";
import AudioPlayer from "react-h5-audio-player"
import town from "./town-10169.mp3"
import React, { useRef, useState,useEffect ,Component} from 'react';
import WaveSurfer from 'wavesurfer.js';



class Audio extends Component {
    constructor(props){
      super(props)
      this.state={
        bass:0,
        mid:0,
        treble:0,
        demoAudio: null
      }
    }
    
    
    async onFileChange(e) {
      const file = e.target.files[0];
      await FFMPEG.process(
        file,
        '-metadata location="" -metadata location-eng="" -metadata author="" -c:v copy -c:a copy',
        function (e) {
          const video = e.result;
          console.log(video);
          this.setState({demoAudio:video})
          console.log(this.demoAudio)
          const link = document.createElement('a');
          link.href = video;
          link.download = video.name; // Specify the desired filename
          link.click();
        }.bind(this)
      );
    }
    render() {
      console.log(this.state.bass)
      // console.log(this.state.demoAudio)
      return (
      <>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={this.onFileChange}
        />
        <br></br>
          Bass<input type='range'  min={-10}
          max={10}
          step={1}
          value={this.state.bass}
          onChange={(event)=>{this.setState({bass:event.target.value})}}
        />
  
          Mid<input type='range'  min={-10}
          max={10}
          step={1}
          value={this.state.mid}
          onChange={(event)=>{this.setState({mid:event.target.value})}}
          />
  
          Treble<input type='range'  min={-10}
          max={10}
          step={1}
          value={this.state.treble}
          onChange={(event)=>{this.setState({treble:event.target.value})}}
          />
        <AudioPlayer
            autoPlay={false}
            volume={0}
            src={town}
            onPause={(e) => {
              // setState({ ...state, status: Sound.status.PAUSED });
              console.log("onPause");
            }}
            onPlay={(e) => {
              // setState({ ...state, status: Sound.status.PLAYING });
              console.log("onPlay");
            }}
            listenInterval={1000}
            onListen={(e) => {
              // setTime(e.timeStamp);
            }}
          />
      </>
      );
    }
  }
  
  export default Audio;
  