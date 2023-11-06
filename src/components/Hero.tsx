import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Play, Pause, CaretLeft, CaretRight, Fullscreen, FullscreenExit } from 'react-bootstrap-icons';
import videojs from 'video.js'
import style from './Hero.module.scss'
import classNames from 'classnames';

export const Hero = ({ videos }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef: any = useRef(null);
  const playerRef: any = useRef(null);

  useEffect(() => {
    init()
  }, [playerRef.current])

  const init = () => {
    if (playerRef.current) return
    if (!videoRef.current) return

    playerRef.current = videojs(videoRef.current);

    playerRef.current.src({ src: `${videos[currentIndex]}`, type: 'video/webm' });
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
    <div className={style['hero--wrapper']}>
      <div className={classNames([style.hero, { [style['hero--fullscreen']]: isFullScreen }])}>
        <div className={style['hero__video']}>
          <video ref={videoRef} autoPlay={true} loop={true} muted={!isFullScreen} />
        </div>
        <div className={style['hero__footer']}>
          { !!isFullScreen && (
            <>
              <Button onClick={toggle} v-if="isFullScreen">
                { isPaused ? <Play font-scale="1.75" /> : <Pause font-scale="1.75" /> }
              </Button>
              <div className={style['hero__footer__navigate']}>
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
            { !isFullScreen ? <Fullscreen font-scale="1.25" /> : <FullscreenExit font-scale="1.25" /> }
          </Button>
        </div>
      </div>
    </div>
  )
}
