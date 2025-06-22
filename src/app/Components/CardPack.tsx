'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Card = {
  name: string;
  image: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
  moves?: string[];
  ability?: string;
};

type CardCollection = {
  [key: string]: { card: Card; count: number };
};

interface CollectedCardEntry {
  card: Card;
  count: number;
}

interface SavedData {
  collectedCards: CardCollection;
  packsOpened: number;
}

export const CardPackOpener: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [packsOpened, setPacksOpened] = useState(0);
  const [collectedCards, setCollectedCards] = useState<CardCollection>({});
  const [showDex, setShowDex] = useState(false);
  const [storageStatus, setStorageStatus] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

const allCards: Card[] = [
    { name: 'Spottle', image: 'Bug.png', rarity: 'Common', moves: ['Bug Buzz'] },
    { name: 'Bagsack', image: 'Bag.png', rarity: 'Common', moves: ['Pummel'] },
    { name: 'Nuzzumi', image: 'Rodent.png', rarity: 'Common', moves: ['Zip Zap'] },
    { name: 'Bouffee', image: 'Sugar.png', rarity: 'Common', moves: ['Sugary Shot'] },
    { name: 'Jinxi', image: 'Luck.png', rarity: 'Common', moves: ['Unluck'] },

    { name: 'Virixen', image: 'GrassBuddy.png', rarity: 'Uncommon', moves: ['Petal Lash'] },
    { name: 'Tsnoko', image: 'Snek.png', rarity: 'Uncommon', moves: ['Sneaky Bite'] },
    { name: 'Salember', image: 'FireBuddy.png', rarity: 'Uncommon', moves: ['Burning Bite'] },
    { name: 'Curshire', image: 'Cat.png', rarity: 'Uncommon', moves: ['Grinning Hex'] },
    { name: 'Porpuddle', image: 'WaterBuddy.png', rarity: 'Uncommon', moves: ['Bubble Burst'] },

    { name: 'Hakuma', image: 'Bear.png', rarity: 'Rare', moves: ['Crushing Hug'] },
    { name: 'Hauntkins', image: 'Ghost.png', rarity: 'Rare', moves: ['Poltergeist'] },
    { name: 'Drangoon', image: 'Blue.png', rarity: 'Rare', moves: ['Dragon Rage'] },
    { name: 'Rookiraven', image: 'Crow.png', rarity: 'Rare', moves: ['Night Slash'] },
    { name: 'Ignhaust', image: 'Flame.png', rarity: 'Rare', moves: ['Inferno Overdrive'] },

    { name: 'Calverus', image: 'Knight.png', rarity: 'Epic', moves: ['Energy Lance'], ability: 'Inspire' },
    { name: 'Yokoni', image: 'Oni.png', rarity: 'Epic', moves: ['Ogre Club', 'Beatdown'] },
    { name: 'Hussarrior', image: 'Knight2.png', rarity: 'Epic', moves: ['Verdant Blades'], ability: 'Justified' },
    { name: 'Kitsune', image: 'Kitsune.png', rarity: 'Epic', moves: ['Fox Trick', 'Spirit Rush'] },
    { name: 'Minocharge', image: 'Knight3.png', rarity: 'Epic', moves: ['Axe Charge'], ability: 'Merciless' },

    { name: 'Cybele', image: 'Plant.png', rarity: 'Legendary', moves: ['Temporal Slash'], ability: 'Forest Blessing' },
    { name: 'Triton', image: 'Water.png', rarity: 'Legendary', moves: ['Torrential Crash', 'Flowing Trident'] },
    { name: 'Gigantis', image: 'Rock.png', rarity: 'Legendary', moves: ['Continental Crush'], ability: 'Sentinel' },
    { name: 'Helios', image: 'Fire.png', rarity: 'Legendary', moves: ['Flame Drive', 'Triple Slice'] },
    { name: 'Hecate', image: 'Dark.png', rarity: 'Legendary', moves: ['Wicked Curse'], ability: 'Twisted Oath' },

    { name: 'Zhuque', image: 'Vermilion.png', rarity: 'Mythical', moves: ['Vermilion Burst'], ability: 'Southern Summer' },
    { name: 'Baihu', image: 'White.png', rarity: 'Mythical', moves: ['White Slash'], ability: 'Western Autumn' },
    { name: 'Chronos', image: 'Chronos.png', rarity: 'Mythical', moves: ['Space-Time Shutdown'], ability: 'Temporal Hex' },
    { name: 'Qinlong', image: 'Azure.png', rarity: 'Mythical', moves: ['Azure Pulse'], ability: 'Eastern Spring' },
    { name: 'Xuanwu', image: 'Black.png', rarity: 'Mythical', moves: ['Black Takedown'], ability: 'Northern Winter' },
  ];


  // Load data from local storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('cardCollection');
      if (savedData) {
        const parsed = JSON.parse(savedData) as SavedData;
        if (parsed.collectedCards && typeof parsed.packsOpened === 'number') {
          const validatedCards: CardCollection = {};
          Object.entries(parsed.collectedCards).forEach(([name, { count }]: [string, CollectedCardEntry]) => {
            const validCard = allCards.find(c => c.name === name);
            if (validCard && typeof count === 'number' && count > 0) {
              validatedCards[name] = { card: validCard, count };
            }
          });
          setCollectedCards(validatedCards);
          setPacksOpened(parsed.packsOpened);
        } else {
          setStorageStatus('Invalid data in localStorage, initializing empty');
        }
      } else {
        setStorageStatus('No data in localStorage, initializing empty');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setStorageStatus('Error loading localStorage, initialized empty');
      setCollectedCards({});
      setPacksOpened(0);
    }
  }, []);

  // Save data to local storage with safeguard
  useEffect(() => {
    if (Object.keys(collectedCards).length > 0 || packsOpened > 0) {
      try {
        localStorage.setItem(
          'cardCollection',
          JSON.stringify({ collectedCards, packsOpened })
        );
        setStorageStatus(`Saved ${Object.keys(collectedCards).length} cards, ${packsOpened} packs`);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setStorageStatus('Error saving to localStorage');
      }
    }
  }, [collectedCards, packsOpened]);

  // Scroll to selected card when dex opens
  useEffect(() => {
    if (showDex && selectedCard && cardRefs.current[selectedCard]) {
      cardRefs.current[selectedCard]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showDex, selectedCard]);

  const clearStorage = () => {
    try {
      localStorage.removeItem('cardCollection');
      setCollectedCards({});
      setPacksOpened(0);
      setCards([]);
      setFlipped([]);
      setRevealed([]);
      setStorageStatus('Cleared localStorage');
      console.log('Cleared localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setStorageStatus('Error clearing localStorage');
    }
  };

  const getRarityIcon = (rarity: Card['rarity']) => {
    switch (rarity) {
      case 'Common': return '♦';
      case 'Uncommon': return '♦♦';
      case 'Rare': return '♦♦♦';
      case 'Epic': return '♦♦♦♦';
      case 'Legendary': return '★';
      case 'Mythical': return '♛';
      default: return '';
    }
  };

  const rarityWeights: Record<Card['rarity'], number> = {
    Common: 40,
    Uncommon: 25,
    Rare: 15,
    Epic: 10,
    Legendary: 7,
    Mythical: 3,
  };

  function getRandomCard(): Card {
    const pool: Card[] = [];
    allCards.forEach(card => {
      const weight = rarityWeights[card.rarity];
      for (let i = 0; i < weight; i++) pool.push(card);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const openPack = () => {
    if (opening) return;
    setOpening(true);

    const newCards: Card[] = [];
    for (let i = 0; i < 5; i++) {
      newCards.push(getRandomCard());
    }

    const updatedCollected = { ...collectedCards };
    newCards.forEach((card) => {
      if (updatedCollected[card.name]) {
        updatedCollected[card.name].count += 1;
      } else {
        updatedCollected[card.name] = { card, count: 1 };
      }
    });
    setCollectedCards(updatedCollected);

    setPacksOpened(prev => prev + 1);

    setCards(newCards);
    setFlipped([true, true, true, true, true]);
    setRevealed([false, false, false, false, false]);

    newCards.forEach((_, index) => {
      setTimeout(() => {
        setFlipped(prev => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });

        setTimeout(() => {
          setRevealed(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, 200);

        if (index === 4) setOpening(false);
      }, 1000 + index * 400);
    });
  };

  const handleCardClick = (cardName: string) => {
    setSelectedCard(cardName);
    setShowDex(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Card Pack Opening</h2>
      <div className="text-sm text-gray-400 mb-4">{storageStatus}</div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={openPack}
          disabled={opening}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          {opening ? 'Opening...' : 'Open Pack'}
        </button>
        <button
          onClick={clearStorage}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Collection
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 perspective">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="w-44 h-64 relative"
          >
            <motion.div
              initial={true}
              animate={{ rotateY: flipped[idx] ? 0 : 180 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full transform-style-preserve-3d"
            >
              <div className="absolute w-full h-full backface-hidden">
                <Image
                  src="/assets/cardback.png"
                  alt="Card Back"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl border-4 border-gray-600"
                />
              </div>

              <div
                className={`absolute w-full h-full rotateY-180 backface-hidden rounded-xl border-4 flex flex-col items-center text-center shadow-lg ${getRarityColorClass(card.rarity)} ${card.rarity === 'Mythical' && revealed[idx] ? 'glow-mythical' : ''} ${revealed[idx] ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                onClick={() => revealed[idx] && handleCardClick(card.name)}
              >
                {revealed[idx] && (
                  <>
                    <Image
                      src={`/assets/cards/${card.image}`}
                      alt={card.name}
                      width={200}
                      height={200}
                      className="mb-2 w-[150px] h-auto rounded-t-lg"
                    />
                    <div className="font-bold">{card.name}</div>
                    <div className={`text-sm opacity-80 mb-1 ${card.rarity === "Mythical" ? 'text-[#ffd700]' : 'text-white'}`}>{getRarityIcon(card.rarity)}</div>
                    {card.ability && (
                      <div className="text-xs font-semibold text-yellow-300">★ {card.ability}</div>
                    )}
                    {card.moves && card.moves.map((move, i) => (
                      <div key={i} className="text-xs italic mt-1">{move}</div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 mt-6 items-center">
        <div className="text-lg font-semibold">📦 Packs Opened: {packsOpened}</div>
        <button
          onClick={() => {
            setSelectedCard(null);
            setShowDex(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded"
        >
          📖 View Card Dex
        </button>
      </div>
      {showDex && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-6">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full p-6 text-white relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowDex(false);
                setSelectedCard(null);
              }}
              className="absolute top-2 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">📖 Card Dex</h3>
            <p className="mb-4">You&apos;ve collected {Object.keys(collectedCards).length} out of {allCards.length} cards.</p>
            
            <div className="grid grid-cols-5 gap-4">
              {allCards.map(card => {
                const owned = collectedCards[card.name];
                return (
                  <div
                    key={card.name}
                    ref={(el) => { cardRefs.current[card.name] = el; }}
                    className={`p-2 rounded border text-center text-sm ${owned ? 'bg-green-700 border-green-500' : 'bg-gray-700 border-gray-500 opacity-50'} ${selectedCard === card.name ? 'border-4 border-yellow-400 glow-selected' : ''}`}
                  >
                    <div className="font-semibold">{card.name}</div>
                    <div className={`${card.rarity === "Mythical" ? 'text-[#ffd700]' : 'text-white'}`}>{getRarityIcon(card.rarity)}</div>
                    {owned ? (
                      <div className="text-xs">Owned: {owned.count}</div>
                    ) : (
                      <div className="text-xs italic">Missing</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getRarityColorClass(rarity: Card['rarity']) {
  switch (rarity) {
    case 'Common':
      return 'border-green-500 bg-green-900';
    case 'Uncommon':
      return 'border-blue-500 bg-blue-900';
    case 'Rare':
      return 'border-purple-500 bg-purple-900';
    case 'Epic':
      return 'border-orange-500 bg-orange-900';
    case 'Legendary':
      return 'border-yellow-400 bg-yellow-800';
    case 'Mythical':
      return 'border-white-600 bg-black glow-pulse';
    default:
      return '';
  }
}