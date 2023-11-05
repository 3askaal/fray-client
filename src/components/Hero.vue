<template>
  <div class="hero--wrapper">
    <div class="hero" :class="{ 'hero--fullscreen': isFullScreen }">
      <div class="hero__video">
        <video ref="video" autoplay loop :muted="!isFullScreen" />
      </div>
      <div class="hero__footer">
        <b-button @click="toggle" v-if="isFullScreen">
          <b-icon-play font-scale="1.75" v-if="isPaused" />
          <b-icon-pause font-scale="1.75" v-else />
        </b-button>
        <div class="hero__footer__navigate" v-if="isFullScreen">
          <b-button @click="() => navigate(-1)" :disabled="currentIndex === 0">
            <b-icon-caret-left font-scale="1.75" />
          </b-button>
          <b-button @click="() => navigate(1)" :disabled="currentIndex === (videos.length - 1)">
            <b-icon-caret-right font-scale="1.75" />
          </b-button>
        </div>
        <b-button @click="isFullScreen = !isFullScreen">
          <b-icon-fullscreen font-scale="1.25" v-if="!isFullScreen" />
          <b-icon-fullscreen-exit font-scale="1.25" v-else />
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  props: ['videos'],
  data() {
    return {
      player: null,
      currentIndex: 0,
      isFullScreen: false,
      isPaused: false
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    init() {
      if (!this.player) {
        this.player = videojs(this.$refs.video);
      }

      this.player.src({ src: `${this.baseUrl}${this.videos[this.currentIndex]}`, type: 'video/webm' });
      this.player.play();
    },
    toggle() {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }

      this.isPaused = this.player.paused();
    },
    navigate(direction) {
      if (this.currentIndex === (this.videos.length - 1) && direction === 1) {
        return;
      }

      if (this.currentIndex === 0 && direction === -1) {
        return;
      }

      this.currentIndex += direction;

      this.init();
    },
  }
}
</script>

<style lang="scss">
.hero--wrapper {
  position: relative;
  top: 0;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.hero {
  height: 100%;
  width: 100%;

  &--fullscreen {
    position: fixed;
    z-index: 1000;
  }
}

.hero__video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: .6;
  filter: grayscale(1);

  .hero--fullscreen & {
    transition: all .4s ease;
    filter: grayscale(0);
    opacity: 1;
  }
}

.hero__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  .hero--fullscreen & {
    justify-content: space-between;
  }

  button {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 1rem;
  }

  svg {
    stroke: $black;
  }
}

video {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

[class^="vjs-"] {
  display: none;
}

.vjs-playing,
.vjs-paused {
  display: block !important;

  * {
    display: none;
  }

  video {
    display: block;
  }
}

.hero__icon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;

  svg {
    display: block;
    height: 100%;
    max-width: 40px;
    fill: $white;
    overflow: hidden;
  }
}
</style>
