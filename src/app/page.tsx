'use client';

import { useEffect, useState } from 'react';
import SlotMachineLoader from './Components/SlotMachineLoader';
import SlotMachineIcons from './Components/SlotMachineIcons';
import TransitionIcons from './Components/TransitionIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { contact, projects } from '@/Utils/interfaces';
import { useInView } from 'react-intersection-observer';

const sectionBackgrounds: Record<string, string> = {
  welcome: 'bg-gradient-to-br from-[#8B0000] via-[#B22222] to-black',
  about: 'bg-gradient-to-br from-[#FFF8DC] via-[#F5F5DC] to-[#2F4F4F]',
  projects: 'bg-gradient-to-br from-[#013220] via-[#006400] to-black',
  skills: 'bg-gradient-to-br from-black via-[#1C1C1C] to-[#2F4F4F]',
  contact: 'bg-gradient-to-br from-[#FFD700] via-[#FFB700] to-black'
};


const suits = [
  { src: '/assets/suit-club-fill.svg', color: 'black' },
  { src: '/assets/suit-diamond-fill.svg', color: 'red' },
  { src: '/assets/suit-heart-fill.svg', color: 'red' },
];

function Section({
  id,
  setActiveSection,
  children,
}: {
  id: string;
  setActiveSection: (id: string) => void;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  return (
    <motion.section
      ref={ref}
      className="h-screen snap-start flex flex-col justify-center px-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [showTransitionIcons, setShowTransitionIcons] = useState(false);

  useEffect(() => {
    setShowTransitionIcons(true);
    const timer = setTimeout(() => setShowTransitionIcons(false), 750);
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <>
      {!loaded ? (
        <SlotMachineLoader onComplete={() => setLoaded(true)} />
      ) : (
        <>
          <AnimatePresence>
            {showTransitionIcons && <TransitionIcons />}
          </AnimatePresence>

          <motion.main
  className={`h-screen overflow-y-scroll snap-y snap-mandatory transition-colors duration-1000 ${
    sectionBackgrounds[activeSection]
  } ${activeSection === 'about' || activeSection === 'contact' ? 'text-black' : 'text-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Section id="welcome" setActiveSection={setActiveSection}>
              <h1 className="text-5xl font-bold">Welcome to GPR&apos; Portfolio</h1>
            </Section>

            <Section id="about" setActiveSection={setActiveSection}>
              <h2 className="text-3xl font-semibold">About Me</h2>
              <div className="mt-2 text-lg">
                <p className='mt-2'>Hi, I&apos;m Gianpaolo Raphael N. Reinares, a Junior Web Developer based in Stockton, CA. I specialize in building responsive and scalable web applications using modern technologies like TypeScript, React, and Next.js.</p>
                <p className='mt-2'>
                Outside of coding, I&apos;ve worked as a remote inventory assistant and freelance graphic designer, sharpening my communication and organizational skills. I&apos;m highly collaborative, quick to adapt, and excited to grow within a creative and fast-paced development team.</p>
              </div>
            </Section>

            <Section id="projects" setActiveSection={setActiveSection}>
              <h2 className="text-3xl font-semibold">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {projects.map((project, i) => {
    const suit = suits[i % suits.length];
    return (
      <motion.div
        key={project.name}
        className={`relative bg-white rounded-xl shadow-lg border-2 cursor-pointer overflow-hidden group
          ${suit.color === 'red' ? 'border-red-600 text-red-700' : 'border-black text-black'}`}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={project.thumbnail}
          alt={`${project.name} thumbnail`}
          className="w-full h-40 object-cover rounded-t-xl"
        />

        <img src={suit.src} alt="suit" className="absolute top-4 left-4 w-5 h-5 opacity-80" />

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-90 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
          <p className="text-sm mb-2 text-center">{project.description}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-400 underline hover:text-blue-300"
          >
            View Project Repository
          </a>
        </div>
      </motion.div>
    );
  })}
</div>


            </Section>

            <Section id="skills" setActiveSection={setActiveSection}>
              <h2 className="text-3xl font-semibold">Skills</h2>
              <h2 className="text-2xl font-semibold mt-4 text-center">Languages</h2>
              <SlotMachineIcons
                targetIcons={[
                  'js.png',
                  'ts.png',
                  'cs.png',
                  'html.png',
                  'css.png',
                ]}
              />
              <h2 className="text-2xl font-semibold mt-4 text-center">
                Frameworks/Libraries
              </h2>
              <SlotMachineIcons
                targetIcons={[
                  'react.png',
                  'next.png',
                  'tailwind.png',
                  'bootstrap.png',
                  'shadcn.png',
                ]}
              />
            </Section>

            <Section id="contact" setActiveSection={setActiveSection}>
  <h2 className="text-4xl font-bold mb-6 text-center">Contact</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
  {[
  {
    title: 'Phone',
    icon: '/assets/telephone.svg',
    content: <p className="text-lg">{contact.phone}</p>,
  },
  {
    title: 'Email',
    icon: '/assets/envelope.svg',
    content: (
      <a
        href={`mailto:${contact.email}`}
        className="text-blue-600 hover:underline break-all"
      >
        {contact.email}
      </a>
    ),
  },
  {
    title: 'Links',
    icon: '/assets/link-45deg.svg',
    content: (
      <ul className="space-y-2">
        <li>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Resume
          </a>
        </li>
      </ul>
    ),
  },
].map((card, i) => {
  const suit = suits[i % suits.length];
  return (
    <motion.div
      key={card.title}
      className={`relative bg-white rounded-xl shadow-md p-6 w-64 h-80 border-2 ${
        suit.color === 'red' ? 'border-red-600 text-red-700' : 'border-black text-black'
      } text-center font-serif [transform-style:preserve-3d]`}
      initial={{ rotateY: -90, y: 100, opacity: 0 }}
      whileInView={{
        rotateY: 0,
        y: 0,
        opacity: 1,
        transition: {
          delay: i * 0.3,
          duration: 0.8,
          ease: 'easeOut',
        },
      }}
      viewport={{ once: true }}
      whileHover={{ rotate: i % 2 === 0 ? -3 : 3, scale: 1.05 }}
    >
      <img
        src={suit.src}
        alt="suit"
        className="absolute top-3 left-3 w-5 h-5"
      />
      <img
        src={suit.src}
        alt="suit"
        className="absolute bottom-3 right-3 w-5 h-5 rotate-180"
      />

      <img
        src={card.icon}
        alt={`${card.title} icon`}
        className="mx-auto w-10 h-10 mb-2"
      />

      <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
      {card.content}
    </motion.div>
  );
})}
  </div>
</Section>


          </motion.main>
        </>
      )}
    </>
  );
}
