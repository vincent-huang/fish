import { motion } from 'motion/react';
import { useMemo } from 'react';

const SHIMMER_COUNT = 40;

export default function Sea() {
  const shimmers = useMemo(() => {
    return Array.from({ length: SHIMMER_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[55%] overflow-hidden">
      {/* Sea Base Color */}
      <div className="absolute inset-0 bg-[#0c2461] opacity-90" />
      
      {/* Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2980b9]/30 via-transparent to-[#0a3d62]" />

      {/* Sun Reflection */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-full bg-gradient-to-b from-[#f1c40f]/40 via-[#f39c12]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Ripples / Waves (Wave animation using motion) */}
      <motion.div 
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ 
          duration: 20, 
          ease: 'linear', 
          repeat: Infinity 
        }}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '400px'
        }}
      />

      {/* Shimmering Glimmers */}
      <div className="absolute inset-0 pointer-events-none">
        {shimmers.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [s.scale * 0.8, s.scale, s.scale * 0.8],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-0.5 bg-white rounded-full blur-[1px]"
            style={{
              left: s.left,
              top: s.top,
              boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.4)'
            }}
          />
        ))}
      </div>

      {/* Horizon Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
    </div>
  );
}
