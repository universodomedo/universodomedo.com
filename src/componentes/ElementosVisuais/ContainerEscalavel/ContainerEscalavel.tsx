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
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowRatio = windowWidth / windowHeight;

      const newScale = windowRatio > targetRatio
        ? windowHeight / targetHeight
        : windowWidth / targetWidth;

      document.documentElement.style.setProperty('--scale', newScale.toString());
    };

    const throttledUpdateScale = throttle(updateScale, 100);
    updateScale();

    window.addEventListener('resize', throttledUpdateScale);
    document.addEventListener('fullscreenchange', updateScale);

    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (e.key.toLowerCase() === 'f') {
    //     toggleFullscreen();
    //   }
    // };

    // window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', throttledUpdateScale);
      document.removeEventListener('fullscreenchange', updateScale);
      // window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleFullscreen = () => {
    const element = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} id={styles.container_escalavel}>
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