'use client';

import { useEffect, useState } from 'react';
import SlotMachineLoader from './Components/SlotMachineLoader';
import SlotMachineIcons from './Components/SlotMachineIcons';
import TransitionIcons from './Components/TransitionIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { contact, projects } from '@/Utils/interfaces';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import { forwardRef } from 'react';

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

const Section = forwardRef(function Section(
  {
    id,
    setActiveSection,
    children,
  }: {
    id: string;
    setActiveSection: (id: string) => void;
    children: React.ReactNode;
  },
  ref: React.Ref<HTMLElement>
) {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const setRefs = (node: HTMLElement) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.RefObject<HTMLElement | undefined>).current = node;
    inViewRef(node);
  };

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  return (
    <motion.section
      ref={setRefs}
      className="h-screen snap-start flex flex-col justify-center px-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [showTransitionIcons, setShowTransitionIcons] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sectionOrder.indexOf(activeSection);
  
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const nextIndex = Math.min(currentIndex + 1, sectionOrder.length - 1);
        const nextSection = sectionOrder[nextIndex];
        sectionRefs.current[nextSection]?.scrollIntoView({ behavior: 'smooth' });      }
  
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const prevIndex = Math.max(currentIndex - 1, 0);
        const prevSection = sectionOrder[prevIndex];
        sectionRefs.current[prevSection]?.scrollIntoView({ behavior: 'smooth' });      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);
  

  useEffect(() => {
    setShowTransitionIcons(true);
    const timer = setTimeout(() => setShowTransitionIcons(false), 750);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const sectionOrder = ['welcome', 'about', 'projects', 'skills', 'contact'];
  const sectionRefs = useRef<Record<string, HTMLElement | undefined>>(
    Object.fromEntries(sectionOrder.map((key) => [key, undefined]))
  );

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
            <Section id="welcome" setActiveSection={setActiveSection} ref={(el) => {if (el) sectionRefs.current.welcome = el;}}>
              <h1 className="text-5xl font-bold">Welcome to GPR&apos;s Portfolio</h1>
            </Section>

            <Section id="about" setActiveSection={setActiveSection} ref={(el) => {if (el) sectionRefs.current.about = el;}}>
              <h2 className="text-3xl font-semibold">About Me</h2>
              <div className="relative mt-2 text-lg bg-[#f4f4f46f] p-6 rounded-2xl border-solid border-black border-2">
              
              <div className="absolute top-2 left-2 ">
              <img src={"/assets/suit-club-fill.svg"} alt="suit" className="w-5 h-5 opacity-80" />
              </div>

              <div className="absolute top-2 right-2 ">
              <img src={"/assets/suit-heart-fill.svg"} alt="suit" className="w-5 h-5 opacity-80" />
              </div>

              <div className="absolute bottom-2 left-2 ">
              <img src={"/assets/suit-diamond-fill.svg"} alt="suit" className="w-5 h-5 opacity-80" />
              </div>

              <div className="absolute bottom-2 right-2 ">
                <img src={"/assets/suit-spade-fill.svg"} alt="suit" className="w-5 h-5 opacity-80" />
              </div>
                <p className='mt-2'>Hi, I&apos;m Gianpaolo Raphael N. Reinares, a Junior Web Developer based in Stockton, CA. I specialize in building responsive and scalable web applications using modern technologies like TypeScript, React, and Next.js.</p>
                <p className='mt-2'>As a student from CodeStack Academy, I&apos;ve logged over 1000 hours of hands-on, full-time training in full-stack web development, cloud deployment, and RESTful APIs. I led the development of PlatO, a full-stack social platform with real-time features, authentication, and post sharing.</p>
                <p className='mt-2'>
                Outside of coding, I&apos;ve worked as a remote inventory assistant and freelance graphic designer, sharpening my communication and organizational skills. I&apos;m highly collaborative, quick to adapt, and excited to grow within a creative and fast-paced development team.</p>
              </div>
            </Section>

            <Section id="projects" setActiveSection={setActiveSection} ref={(el) => {if (el) sectionRefs.current.projects = el;}}>
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

            <Section id="skills" setActiveSection={setActiveSection} ref={(el) => {if (el) sectionRefs.current.skills = el;}}>
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

            <Section id="contact" setActiveSection={setActiveSection} ref={(el) => {if (el) sectionRefs.current.contact = el;}}>
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
  } text-center font-serif [transform-style:preserve-3d] flex flex-col justify-center items-center`}
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

  <div className="flex flex-col items-center justify-center text-center">
    <img
      src={card.icon}
      alt={`${card.title} icon`}
      className="w-10 h-10 mb-2"
    />
    <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
    {card.content}
  </div>
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
