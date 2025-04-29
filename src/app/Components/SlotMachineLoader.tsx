'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const allImages = [
  'discord.svg', 'github.svg', 'twitter-x.svg',
  'unity.svg', 'suit-club-fill.svg', 'suit-diamond-fill.svg',
  'suit-heart-fill.svg', 'suit-spade-fill.svg'
];

const targetImages = ['g.svg', 'p.svg', 'r.svg'];

type Props = {
  onComplete: () => void;
};

const SlotMachineLoader: React.FC<Props> = ({ onComplete }) => {
  const [slots, setSlots] = useState(['', '', '']);
  const [locked, setLocked] = useState([false, false, false]);
  const [transitioning, setTransitioning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    let progress = 0;

    targetImages.forEach((target, i) => {
      let count = 0;

      const interval = setInterval(() => {
        setSlots((prev) => {
          const updated = [...prev];
          updated[i] = allImages[Math.floor(Math.random() * allImages.length)];
          return updated;
        });

        count++;

        progress = (i + count / 15) / targetImages.length;
        setLoadingProgress(progress);

        if (count > 15 + i * 5) {
          clearInterval(interval);
          setSlots((prev) => {
            const updated = [...prev];
            updated[i] = target;
            return updated;
          });

          setLocked((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
        }
      }, 80 - i * 10);
      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  useEffect(() => {
    if (locked.every(Boolean)) {
      setTimeout(() => {
        setTransitioning(true);
        setTimeout(onComplete, 1000);
      }, 1200);
    }
  }, [locked, onComplete]);

  return (
    <motion.div
      className="h-screen w-screen bg-black flex items-center justify-center gap-6 relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: transitioning ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {slots.map((img, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.9 }}
          animate={{ scale: locked[i] ? 1.2 : 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-24 h-24 rounded-xl border-4 border-white overflow-hidden shadow-2xl bg-white flex items-center justify-center"
        >
          {img && (
            <Image
              src={`/assets/${img}`}
              alt={`slot-${i}`}
              width={96}
              height={96}
              className="object-contain"
            />
          )}
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-white rounded-full"
          style={{ width: `${loadingProgress * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SlotMachineLoader;
