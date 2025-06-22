// hooks/use-window-size.js

"use client";
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: document.documentElement.scrollHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    // Initial size
    handleResize();

    // Re-check size after a short delay to account for content rendering
    const timeoutId = setTimeout(handleResize, 100);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
    }
  }, []);

  return size;
}