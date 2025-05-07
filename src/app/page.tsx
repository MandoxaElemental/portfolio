'use client';
import { useState } from 'react';
import SlotMachineLoader from './Components/SlotMachineLoader';
import { motion } from 'framer-motion';
import { aboutMe, contact, projects } from '@/Utils/interfaces';
import SlotMachineIcons from './Components/SlotMachineIcons';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  const sectionBackgrounds: Record<string, string> = {
    welcome: 'bg-gradient-to-br from-white to-gray-500',
    about: 'bg-gradient-to-br from-blue-100 to-blue-300',
    projects: 'bg-gradient-to-br from-purple-100 to-purple-300',
    skills: 'bg-gradient-to-br from-green-100 to-green-300',
    contact: 'bg-gradient-to-br from-yellow-100 to-yellow-300',
  };

  return (
    <>
      {!loaded ? (
        <SlotMachineLoader onComplete={() => setLoaded(true)} />
      ) : (
        <motion.main
          className={`h-screen overflow-y-scroll snap-y snap-mandatory text-black transition-colors duration-1000 ${sectionBackgrounds[activeSection]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.section
            className="h-screen snap-start flex flex-col justify-center px-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActiveSection('welcome')}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold">Welcome to GPR Portfolio</h1>
          </motion.section>

          <motion.section
            className="h-screen snap-start flex flex-col justify-center px-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActiveSection('about')}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold">About Me</h2>
            <p className="mt-2 text-lg">{aboutMe}</p>
          </motion.section>

          <motion.section
            className="h-screen snap-start flex flex-col justify-center px-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActiveSection('projects')}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold">Projects</h2>
            <ul className="space-y-4 mt-2">
              {projects.map((project) => (
                <li key={project.name}>
                  <a href={project.link} className="text-blue-600 underline text-xl" target="_blank">
                    {project.name}
                  </a>
                  <p className="text-gray-700">{project.description}</p>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="h-screen snap-start flex flex-col justify-center items-center px-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActiveSection('skills')}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold">Skills</h2>
            <h2 className="text-2xl font-semibold mt-4">Languages</h2>
            <SlotMachineIcons
              targetIcons={[
                'js.png', 'ts.png', 'cs.png', 'html.png', 'css.png'
              ]}
            />
            <h2 className="text-2xl font-semibold mt-4">Frameworks/Libraries</h2>
            <SlotMachineIcons
              targetIcons={[
                'react.png', 'next.png', 'tailwind.png', 'bootstrap.png', 'shadcn.png'
              ]}
            />
          </motion.section>

          <motion.section
            className="h-screen snap-start flex flex-col justify-center px-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActiveSection('contact')}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold">Contact</h2>
            <p>Phone: {contact.phone}</p>
            <p>Email: <a href={`mailto:${contact.email}`} className="text-blue-600 underline">{contact.email}</a></p>
            <div className="flex gap-4 mt-2">
              <a href={contact.linkedin} target="_blank" className="text-blue-600 underline">LinkedIn</a>
              <a href={contact.github} target="_blank" className="text-blue-600 underline">GitHub</a>
              <a href={contact.resume} target="_blank" className="text-blue-600 underline">Resume</a>
            </div>
          </motion.section>
        </motion.main>
      )}
    </>
  );
}
