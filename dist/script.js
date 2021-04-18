const player = Vue.createApp({
  data() {
    return {
      isPlaying: false,
      hasBegun: false,
      videoStyle: {
        height: '95%'
      },
      controlsStyle: {
        width: '0%'
      },
    }
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    handleWindowResize(event) {
      this.scaleAndTransformControls();
    },
    getVideo() {
      return this.$refs.video;
    },
    getSeekbar() {
      return this.$refs.seekbar;
    },
    getControls() {
      return this.$refs.controls;
    },
    getActualVideoAspectRatio() {
      const video = this.getVideo();
      return video.videoWidth / video.videoHeight;
    },
    getVideoAspectRatio() {
      const video = this.getVideo();
      return video.offsetWidth / video.offsetHeight;
    },
    getVideoWidth() {
      const video = this.getVideo();
      return video.offsetWidth;
    },
    getVideoHeight() {
      const video = this.getVideo();
      return video.offsetHeight;
    },
    getControlsHeight() {
      const controls = this.getControls();
      return controls.offsetHeight;
    },
    getActualVideoWidth() {
      if (this.getVideoAspectRatio() > this.getActualVideoAspectRatio()) {
        return this.getVideoHeight() * this.getActualVideoAspectRatio();
      } else {
        return this.getVideoWidth();
      }
    },
    getActualVideoHeight() {
      if (this.getVideoAspectRatio() < this.getActualVideoAspectRatio()) {
        return this.getVideoWidth() / this.getActualVideoAspectRatio();
      } else {
        return this.getVideoHeight();
      }
    },
    getControlsOffset() {
      if (this.getVideoAspectRatio() < this.getActualVideoAspectRatio()) {
        return (window.innerHeight - this.getActualVideoHeight()) /2 - this.getControlsHeight();
      } else {
        return 0;
      }
    },
    scaleAndTransformControls() {
      // Not sure why a constant 23 is needed here (used trial and error) (check docs/Portrait.jpg)
      this.controlsStyle = { width: this.getActualVideoWidth()+'px', bottom: this.getControlsOffset() + 23 + 'px' };
    },
    toggleVideoPlaying() {
      if(!this.hasBegun) {
        setTimeout(() =>{
          this.scaleAndTransformControls();
        }, 50)
        this.hasBegun = !this.hasBegun;
      }
      const video = this.getVideo();
      video.paused? video.play() : video.pause();
      this.isPlaying = !this.isPlaying;
    },
    updateRangeValue() {
      const video = this.getVideo();
      const percentagePlayed = video.currentTime / video.duration * 100;
      const seekbar = this.getSeekbar();
      seekbar.value = percentagePlayed;
    },
    setVideoSeek() {
      const seekbar = this.getSeekbar();
      const percentageToSeek = seekbar.value;
      const video = this.getVideo();
      const seekInSeconds = video.duration * percentageToSeek / 100;
      video.currentTime = seekInSeconds;
    }
  }
    
});

player.mount('#player');