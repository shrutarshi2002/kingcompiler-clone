"use client";
import { useEffect, useRef } from "react";

const SoundManager = ({ enabled = true }) => {
  const audioRefs = useRef({});

  useEffect(() => {
    // Preload all sound files
    const sounds = {
      move: "/sounds/move.mp3",
      capture: "/sounds/capture.mp3",
      puzzleComplete: "/sounds/puzzle-complete.mp3",
      wrongMove: "/sounds/wrong-move.mp3",
      levelComplete: "/sounds/level-complete.mp3",
      starCollect: "/sounds/star-collect.mp3",
    };

    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.6;
      audioRefs.current[key] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const playSound = (soundType) => {
    if (!enabled) return;

    const audio = audioRefs.current[soundType];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
  };

  // Expose playSound function globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.playChessSound = playSound;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.playChessSound;
      }
    };
  }, [enabled]);

  return null; // This component doesn't render anything
};

export default SoundManager;
