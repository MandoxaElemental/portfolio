'use client';
import { useState } from 'react';
import SlotMachineLoader from './Components/SlotMachineLoader';
import { motion } from 'framer-motion';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
 {/* Loader screen */}
 {!loaded ? (
        <SlotMachineLoader onComplete={() => setLoaded(true)} />
      ) : (
        <motion.main
          className="min-h-screen bg-white text-black p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">Welcome to GPR's Portfolio</h1>
          {/* Your content here */}
        </motion.main>
      )}
    </>
  );
}
