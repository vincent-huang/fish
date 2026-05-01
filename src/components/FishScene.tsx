import React, { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'motion/react';

const FISH_COUNT = 15;

interface FishProps {
  id: number;
  key?: React.Key;
}

const Fish = ({ id }: FishProps) => {
  const controls = useAnimation();
  
  // Randomize initial properties
  const config = useMemo(() => {
    const size = 15 + Math.random() * 25;
    const isLeft = Math.random() > 0.5;
    const startX = isLeft ? -100 : 1200; // Use a fixed large value or handle via css
    const startY = 40 + Math.random() * 50; // Percentage of the sea area
    const speed = 15 + Math.random() * 25;
    return { size, isLeft, startX, startY, speed };
  }, []);

  useEffect(() => {
    let mounted = true;
    const sequence = async () => {
      while (mounted) {
        const targetX = config.isLeft ? 1300 : -200;
        const currentX = config.startX;
        
        // Horizontal swim
        try {
          await controls.start({
            x: [currentX, targetX],
            y: [
              `${config.startY}%`, 
              `${config.startY + (Math.random() * 10 - 5)}%`, 
              `${config.startY}%`
            ],
            rotateY: config.isLeft ? 0 : 180,
            transition: { 
              x: { duration: config.speed, ease: "linear" },
              y: { duration: config.speed / 2, ease: "easeInOut", repeat: 1 }
            }
          });
        } catch (e) {
          // Animation cancelled usually on unmount
          break;
        }

        // Loop back - reset to start
        if (mounted) {
          controls.set({ x: currentX });
        }
      }
    };
    sequence();
    return () => { mounted = false; };
  }, [controls, config]);

  return (
    <motion.div
      animate={controls}
      className="absolute z-10"
      style={{ width: config.size, height: config.size * 0.4 }}
    >
      <svg
        viewBox="0 0 100 40"
        className="w-full h-full drop-shadow-lg"
        style={{ filter: 'opacity(0.6)' }}
      >
        <path
          d="M0 20 C20 0, 60 0, 80 20 C60 40, 20 40, 0 20 Z"
          fill="rgba(255, 255, 255, 0.4)"
        />
        <path
          d="M80 20 L100 10 L100 30 Z"
          fill="rgba(255, 255, 255, 0.5)"
        />
        {/* Eye */}
        <circle cx="20" cy="15" r="2" fill="rgba(0,0,0,0.3)" />
      </svg>
    </motion.div>
  );
};

export default function FishScene() {
  const fishArray = useMemo(() => Array.from({ length: FISH_COUNT }), []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none">
      {fishArray.map((_, i) => (
        <Fish key={i} id={i} />
      ))}
    </div>
  );
}
