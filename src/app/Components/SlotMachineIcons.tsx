'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const fallbackIcons = [
  'bootstrap.png', 'cs.png', 'css.png', 'html.png', 'js.png',
  'next.png', 'react.png', 'shadcn.png', 'ts.png', 'tailwind.png'
];

type Props = {
  targetIcons: string[];
};

const SlotMachineIcons: React.FC<Props> = ({ targetIcons }) => {
  const [slots, setSlots] = useState<string[]>(targetIcons.map(() => ''));
  const [locked, setLocked] = useState<boolean[]>(targetIcons.map(() => false));
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' });

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    if (inView) {
      targetIcons.forEach((target, i) => {
        let count = 0;

        const interval = setInterval(() => {
          setSlots((prev) => {
            const updated = [...prev];
            updated[i] = fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];
            return updated;
          });

          count++;

          if (count > 8 + i * 2) {
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
        }, 60 - i * 8);
        intervals.push(interval);
      });
    } else {
      setLocked(targetIcons.map(() => false));
      const spinInterval = setInterval(() => {
        setSlots(targetIcons.map(() =>
          fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)]
        ));
      }, 100);
      return () => clearInterval(spinInterval);
    }

    return () => intervals.forEach(clearInterval);
  }, [inView, targetIcons]);

  return (
    <div ref={ref} className="flex flex-wrap gap-4 justify-center mt-6">
      {slots.map((icon, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.9 }}
          animate={{ scale: locked[i] ? 1.2 : 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.4 }}
          className="m-2 w-20 h-20 rounded-lg border-2 border-gray-300 bg-white shadow-md flex items-center justify-center"
        >
          {icon && (
            <Image
              src={`/assets/${icon}`}
              alt={`skill-${i}`}
              width={64}
              height={64}
              className="object-contain"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SlotMachineIcons;
