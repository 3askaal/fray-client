import { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Play, Pause, CaretLeft, CaretRight, Fullscreen, FullscreenExit } from 'react-bootstrap-icons';
import videojs from 'video.js'
import { useApi } from '@/hooks/useApi';

export const Hero = ({ videos }: any) => {
  const { BASE_URL } = useApi()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef: any = useRef(null);
  const playerRef: any = useRef(null);

  const init = () => {
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current);
    }

    playerRef.current.src({ src: `${BASE_URL}${videos[currentIndex]}`, type: 'video/webm' });
    playerRef.current.play();
  }


  const navigate = (direction: number) => {
    if (currentIndex === (videos.length - 1) && direction === 1) {
      return;
    }

    if (currentIndex === 0 && direction === -1) {
      return;
    }

    setCurrentIndex(currentIndex + direction);

    init();
  }

  const toggle = () => {
    if (playerRef.current.paused()) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }

    setIsPaused(playerRef.current.paused());
  }

  return (
    <div className="hero--wrapper">
      <div className={`hero ${isFullScreen ? 'hero--fullscreen' : ''}`}>
        <div className="hero__video">
          <video ref={videoRef} autoPlay={true} loop={true} muted={!isFullScreen} />
        </div>
        <div className="hero__footer">
          { !!isFullScreen && (
            <>
              <Button onClick={toggle} v-if="isFullScreen">
                { isPaused ? <Play font-scale="1.75" v-if="isPaused" /> : <Pause font-scale="1.75" v-else /> }
              </Button>
              <div className="hero__footer__navigate">
                <Button onClick={() => navigate(-1)} disabled={currentIndex === 0}>
                  <CaretLeft font-scale="1.75" />
                </Button>
                <Button onClick={() => navigate(1)} disabled={currentIndex === (videos.length - 1)}>
                  <CaretRight font-scale="1.75" />
                </Button>
              </div>
            </>
          ) }
          <Button onClick={() => setIsFullScreen(!isFullScreen)}>
            <Fullscreen font-scale="1.25" v-if="!isFullScreen" />
            <FullscreenExit font-scale="1.25" v-else />
          </Button>
        </div>
      </div>
    </div>
  )
}
