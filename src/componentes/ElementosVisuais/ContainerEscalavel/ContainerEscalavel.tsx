'use client';

import styles from './styles.module.css';
import { useEffect, useRef } from 'react';

export default function ContainerEscalavel({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetWidth = 1920;
    const targetHeight = 1080;
    const targetRatio = targetWidth / targetHeight;

    const updateScale = () => {
      const vv = window.visualViewport;
      const windowWidth = vv ? vv.width : window.innerWidth;
      const windowHeight = vv ? vv.height : window.innerHeight;
      const windowRatio = windowWidth / windowHeight;

      const newScale = windowRatio > targetRatio ? windowHeight / targetHeight : windowWidth / targetWidth;

      document.documentElement.style.setProperty('--scale', newScale.toString());
      document.documentElement.style.setProperty('--vvh', `${windowHeight * 0.01}px`);

      const el = containerRef.current;
      if (el) {
        const offsetLeft = vv ? vv.offsetLeft : 0;
        const offsetTop = vv ? vv.offsetTop : 0;
        el.style.left = `${offsetLeft + windowWidth / 2}px`;
        el.style.top = `${offsetTop + windowHeight / 2}px`;
      }
    };

    const throttledUpdateScale = throttle(updateScale, 100);
    updateScale();

    window.addEventListener('resize', throttledUpdateScale);
    window.addEventListener('orientationchange', throttledUpdateScale);
    document.addEventListener('fullscreenchange', updateScale);
    window.visualViewport?.addEventListener('resize', throttledUpdateScale);
    window.visualViewport?.addEventListener('scroll', throttledUpdateScale);

    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (e.key.toLowerCase() === 'f') {
    //     toggleFullscreen();
    //   }
    // };

    // window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', throttledUpdateScale);
      window.removeEventListener('orientationchange', throttledUpdateScale);
      document.removeEventListener('fullscreenchange', updateScale);
      window.visualViewport?.removeEventListener('resize', throttledUpdateScale);
      window.visualViewport?.removeEventListener('scroll', throttledUpdateScale);
      // window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleFullscreen = () => {
    const element = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => { console.error(`Erro ao tentar fullscreen: ${err.message}`); });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className={styles.container_escalavel}>
      {children}
    </div>
  );
};

function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};