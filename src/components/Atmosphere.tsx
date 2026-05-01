import { motion } from 'motion/react';

export default function Atmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1a1b4b] via-[#f39c12] to-[#e67e22] opacity-80"
        style={{
          background: 'linear-gradient(to bottom, #1a1b4b 0%, #2980b9 30%, #f39c12 70%, #d35400 100%)'
        }}
      />
      
      {/* Sun */}
      <motion.div
        initial={{ y: '20%', opacity: 0 }}
        animate={{ y: '45%', opacity: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#f1c40f]"
        style={{
          boxShadow: '0 0 100px 40px rgba(241, 196, 15, 0.4), 0 0 200px 80px rgba(230, 126, 34, 0.2)',
          filter: 'blur(2px)'
        }}
      />

      {/* Atmospheric secondary glows */}
      <div className="absolute inset-0 bg-radial-[at_50%_45%] from-[#f1c40f]/20 to-transparent pointer-events-none" />
    </div>
  );
}
