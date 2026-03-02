import { useState } from "react";
import { motion } from "framer-motion";
import Crossword from "./Crossword";
import WordSearch from "./WordSearch";

export default function BirthdayItinerary() {
  const [started, setStarted] = useState(false);
  const [march23Unlocked, setMarch23Unlocked] = useState(false);
  const [march24Unlocked, setMarch24Unlocked] = useState(false);

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const isOpenDate = month === 1 && (date === 28);

  const march23Words = [
    "OUTDOOR",
    "HIKING",
    "GAMES",
    "DINNER",
    "RACING",
  ];

  const march23 = [
    "01:00 AM to 04:30 AM · Travel",
    "04:30 AM to 16:00 PM · Mt. Pinatubo",
    "16:00 PM to 17:00 PM · Check-in",
    "17:00 PM to 20:00 PM · Play games",
    "20:00 PM to 21:00 PM · Dinner",
  ];

  const march24 = [
    "11:00 AM to 12:00 NN · Check-out",
    "12:00 NN to 13:00 PM · SOUQ",
    "13:00 PM to 14:30 PM · Kalem Spa",
    "14:30 PM to 15:00 PM · LA Bakeshop",
    "15:00 PM to 16:00 PM · Clark International Speedway",
    "16:00 PM to 17:30 PM · Travel to Subic Bay",
    "17:30 PM to 19:00 PM · Subic Bay Dinner Cruise",
    "19:00 PM to 23:00 PM · Travel Home",
  ];

  if (!isOpenDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-6">
        <h1 className="text-2xl font-bold">
          Please wait for March 23–24 before opening the file.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-4xl w-full p-10 rounded-3xl shadow-2xl space-y-10 text-center"
      >
        {!started && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">You Are Invited</h1>
            <p className="text-xl">Dandannnnn's 29th Birthday Celebration</p>
            <button
              onClick={() => setStarted(true)}
              className="px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition">
              View Itinerary
            </button>
          </div>
        )}

        {started && !march23Unlocked && (
          <Crossword onComplete={() => setMarch23Unlocked(true)} />
        )}

        {march23Unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-left"
          >
            <h2 className="text-2xl font-bold border-b-2 border-black pb-2">
              March 23
            </h2>

            <div className="space-y-3 border-l-2 border-black pl-4">
              {march23.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </motion.div>
        )}

        {march23Unlocked && !march24Unlocked && (
          <WordSearch
            words={march23Words}
            onComplete={() => setMarch24Unlocked(true)}
          />
        )}

        {march24Unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-left">
            <h2 className="text-2xl font-bold border-b-2 border-black pb-2">
              March 24
            </h2>

            <div className="space-y-3 border-l-2 border-black pl-4">
              {march24.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}