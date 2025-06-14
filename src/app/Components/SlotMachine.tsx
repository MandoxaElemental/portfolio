'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const allImages = [
  'discord.svg', 'github.svg', 'twitter-x.svg',
  'unity.svg', 'suit-club-fill.svg', 'suit-diamond-fill.svg',
  'suit-heart-fill.svg', 'suit-spade-fill.svg', 'wild.svg'
];
const WILD = 'wild.svg';

const pointsMap: Record<string, number> = {
  'discord.svg': 80,
  'github.svg': 100,
  'twitter-x.svg': 120,
  'unity.svg': 150,
  'suit-club-fill.svg': 60,
  'suit-diamond-fill.svg': 60,
  'suit-heart-fill.svg': 60,
  'suit-spade-fill.svg': 60,
  'wild.svg': 0
};

const rarityMap: Record<string, { rarity: string; frequency: number }> = {
  'discord.svg': { rarity: 'Common', frequency: 20 },
  'github.svg': { rarity: 'Uncommon', frequency: 15 },
  'twitter-x.svg': { rarity: 'Rare', frequency: 10 },
  'unity.svg': { rarity: 'Epic', frequency: 5 },
  'suit-club-fill.svg': { rarity: 'Common', frequency: 20 },
  'suit-diamond-fill.svg': { rarity: 'Common', frequency: 20 },
  'suit-heart-fill.svg': { rarity: 'Common', frequency: 20 },
  'suit-spade-fill.svg': { rarity: 'Common', frequency: 20 },
  'wild.svg': { rarity: 'Wild (no points)', frequency: 8 }
};

const createWeightedPool = () => {
  const pool: string[] = [];
  Object.entries(rarityMap).forEach(([icon, { frequency }]) => {
    for (let i = 0; i < frequency; i++) {
      pool.push(icon);
    }
  });
  return pool;
};

const weightedPool = createWeightedPool();

const SlotMachine: React.FC = () => {
  const [bet, setBet] = useState(10);
  const [grid, setGrid] = useState<string[][]>(
    Array(3).fill(null).map(() => Array(3).fill(''))
  );
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [coins, setCoins] = useState(100);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<string>('Checking daily reward...');
  const [storageStatus, setStorageStatus] = useState<string>('Checking localStorage...');

  // Log localStorage state on every render
  console.log('SlotMachine render, localStorage.slotMachineData:', localStorage.getItem('slotMachineData'));

  // Load coins and last claim date from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('slotMachineData');
      console.log('SlotMachine mounted, localStorage.slotMachineData:', savedData);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (typeof parsed.coins === 'number' && parsed.coins >= 0) {
          setCoins(parsed.coins);
          setStorageStatus(`Loaded ${parsed.coins} coins from localStorage`);
        } else {
          setStorageStatus('Invalid coins data, using default (100)');
          console.warn('Invalid coins in localStorage:', parsed.coins);
        }
        if (typeof parsed.lastClaimDate === 'string') {
          setLastClaimDate(parsed.lastClaimDate);
        } else {
          console.warn('Invalid lastClaimDate in localStorage:', parsed.lastClaimDate);
        }
      } else {
        setStorageStatus('No slot machine data in localStorage, using defaults');
        console.log('No slotMachineData in localStorage');
      }
      checkDailyReward();
    } catch (error) {
      console.error('Error loading slot machine data from localStorage:', error);
      setStorageStatus('Error loading localStorage, using defaults');
      setClaimStatus('Error loading data');
    }
  }, []);

  // Save coins and last claim date to localStorage when they change
  useEffect(() => {
    if (coins >= 0) {
      try {
        const data = { coins, lastClaimDate };
        localStorage.setItem('slotMachineData', JSON.stringify(data));
        setStorageStatus(`Saved ${coins} coins to localStorage`);
        console.log('Saved to localStorage:', data);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setStorageStatus('Error saving to localStorage');
        setClaimStatus('Error saving data');
      }
    }
  }, [coins, lastClaimDate]);

  // Check if daily reward is available
  const checkDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastClaimDate !== today) {
      setClaimStatus('Daily reward available: 50 coins!');
    } else {
      setClaimStatus('Daily reward already claimed today. Try again tomorrow!');
    }
  };

  // Claim daily reward
  const claimDailyReward = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastClaimDate !== today) {
      setCoins((prev) => prev + 50);
      setLastClaimDate(today);
      setClaimStatus('Claimed 50 coins! Come back tomorrow for more!');
    }
  };

  // Reset localStorage for debugging
  const resetStorage = () => {
    try {
      localStorage.removeItem('slotMachineData');
      setCoins(100);
      setLastClaimDate(null);
      setStorageStatus('Cleared localStorage, reset to defaults');
      setClaimStatus('Daily reward available: 50 coins!');
      console.log('Cleared slotMachineData from localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setStorageStatus('Error clearing localStorage');
    }
  };

  const spin = () => {
    if (spinning || coins < bet) return;

    setSpinning(true);
    setMessage(null);
    setCoins((prev) => prev - bet);

    const tempGrid = Array(3).fill(null).map(() => Array(3).fill(''));

    let count = 0;
    const totalSpins = 20;

    const interval = setInterval(() => {
      const updatedGrid = tempGrid.map((row) =>
        row.map(() => weightedPool[Math.floor(Math.random() * weightedPool.length)])
      );
      setGrid(updatedGrid);
      count++;

      if (count >= totalSpins) {
        clearInterval(interval);

        const finalGrid = tempGrid.map((row) =>
          row.map(() => allImages[Math.floor(Math.random() * allImages.length)])
        );
        setGrid(finalGrid);

        setTimeout(() => {
          evaluateResult(finalGrid);
          setSpinning(false);
        }, 500);
      }
    }, 80);
  };

  const evaluateResult = (grid: string[][]) => {
    let reward = 0;
    let totalMatches = 0;

    const addMatchReward = (line: string[]) => {
      const nonWilds = line.filter((img) => img !== WILD);
      if (nonWilds.length === 0) return;

      const matchIcon = nonWilds[0];
      const isValid = nonWilds.every((img) => img === matchIcon);
      if (isValid) {
        totalMatches++;
        reward += pointsMap[matchIcon] ?? 50;
      }
    };

    for (const row of grid) addMatchReward(row);

    for (let col = 0; col < 3; col++) {
      const colVals = [grid[0][col], grid[1][col], grid[2][col]];
      addMatchReward(colVals);
    }

    addMatchReward([grid[0][0], grid[1][1], grid[2][2]]);
    addMatchReward([grid[0][2], grid[1][1], grid[2][0]]);

    if (totalMatches === 8) {
      reward += 500;
      setMessage('🌟 ULTIMATE JACKPOT! Full board match!');
    } else if (totalMatches >= 3) {
      setMessage(`🔥 ${totalMatches} matches! Huge win!`);
    } else if (totalMatches > 0) {
      setMessage(`✅ ${totalMatches} line${totalMatches > 1 ? 's' : ''} matched!`);
    } else {
      setMessage('😢 No match, try again.');
    }

    setCoins((prev) => prev + reward * (bet / 10));
  };

  return (
    <div className="flex items-around justify-center text-white gap-6 p-4">
      <div className='flex flex-col items-center justify-center'>
        <div className="text-xl font-bold">💰 Coins: {coins}</div>
        <div className="text-sm text-gray-400 mt-2">{claimStatus}</div>
        <div className="text-sm text-gray-400 mt-1">{storageStatus}</div>

        <div className="grid grid-cols-3 gap-4 mt-2">
          {grid.flat().map((img, i) => (
            <motion.div
              key={i}
              className="w-20 h-20 bg-white border-4 border-white rounded-xl shadow-2xl flex items-center justify-center"
              animate={{ scale: spinning ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {img && (
                <Image
                  src={`/assets/${img}`}
                  alt={`slot-${i}`}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium">🎯 Bet:</span>
          <button
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            onClick={() => setBet((prev) => Math.max(10, prev - 10))}
            disabled={spinning || bet <= 10}
          >
            -10
          </button>
          <span className="px-3 py-1 bg-gray-900 rounded">{bet} coins</span>
          <button
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            onClick={() => setBet((prev) => Math.min(coins, prev + 10))}
            disabled={spinning || bet >= coins}
          >
            +10
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className={`px-6 py-3 rounded-lg text-lg font-bold ${
              spinning || coins < bet
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } transition`}
            onClick={spin}
            disabled={spinning || coins < bet}
          >
            {spinning ? 'Spinning...' : `Spin (${bet} coins) 🎰`}
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              lastClaimDate === new Date().toISOString().split('T')[0]
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
            onClick={claimDailyReward}
            disabled={lastClaimDate === new Date().toISOString().split('T')[0]}
          >
            Claim 50 Coins
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 transition"
            onClick={resetStorage}
          >
            Reset Storage
          </button>
        </div>

        {message && (
          <motion.div
            className="text-xl mt-2 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}
      </div>
      <div className="mt-8 max-w-xl bg-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-bold mb-4 text-center">📜 Points & Rarity Guide</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(pointsMap).map(([icon, points]) => (
            <div key={icon} className="flex flex-col items-center text-sm text-center">
              <Image
                src={`/assets/${icon}`}
                alt={icon}
                width={40}
                height={40}
                className="mb-1 invert"
              />
              <div className="font-semibold">{points} pts</div>
              <div className="text-xs text-gray-300">
                {rarityMap[icon]?.rarity ?? 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;