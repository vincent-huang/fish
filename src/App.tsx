/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Atmosphere from './components/Atmosphere';
import Sea from './components/Sea';
import FishScene from './components/FishScene';
import { motion } from 'motion/react';

export default function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black font-sans selection:bg-orange-500/30">
      {/* Background Layers */}
      <Atmosphere />
      <Sea />
      <FishScene />

      {/* Overlay for Texture */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />

      {/* Poetic Overlay Text */}
      <div className="absolute bottom-12 left-12 z-20 text-white/40 mix-blend-difference pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-2">
            波光粼粼
          </h1>
          <p className="text-sm font-mono tracking-widest opacity-60">
            Shimmering Horizon • Endless Sea
          </p>
        </motion.div>
      </div>

      {/* Viewport Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.5)]" />
    </main>
  );
}
