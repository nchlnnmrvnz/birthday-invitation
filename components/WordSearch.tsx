import { useState } from "react";
import { motion } from "framer-motion";

type WordSearchProps = {
  words: string[];
  onComplete: () => void;
};

export default function WordSearch({ words, onComplete }: WordSearchProps) {
  const grid: string[][] = [
    ["O","U","T","D","O","O","R","X","Z","Q"],
    ["H","I","K","I","N","G","A","B","C","D"],
    ["G","A","M","E","S","L","M","N","O","P"],
    ["R","A","C","I","N","G","Q","R","S","T"],
    ["D","I","N","N","E","R","U","V","W","X"],
    ["A","B","C","D","E","F","G","H","I","J"],
    ["K","L","M","N","O","P","Q","R","S","T"],
  ];

  const [selected, setSelected] = useState<
    { letter: string; row: number; col: number }[]
  >([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState("Find all the hidden activities");

  const handleClick = (letter: string, row: number, col: number) => {
    const newSelected = [...selected, { letter, row, col }];
    setSelected(newSelected);

    const selectedWord = newSelected.map(l => l.letter).join("");

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      const updated = [...foundWords, selectedWord];
      setFoundWords(updated);
      setSelected([]);
      setMessage(`FOUND ${updated.length}/${words.length}`);

      if (updated.length === words.length) {
        setMessage("ALL WORDS UNLOCKED");
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }

    if (
      !words.some(word => word.startsWith(selectedWord)) &&
      selectedWord.length > 0
    ) {
      setSelected([]);
      setMessage("TRY AGAIN");
    }
  };

  return (
    <motion.div className="space-y-6 text-center bg-black text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold">UNLOCK MARCH 23</h2>
      <p className="text-sm">{message}</p>

      <div className="grid grid-cols-10 gap-2 justify-center mt-4">
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isSelected = selected.some(
              s => s.row === rowIndex && s.col === colIndex
            );

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(letter, rowIndex, colIndex)}
                className={`w-10 h-10 text-sm font-bold rounded border-2
                  ${
                    isSelected
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-black border-black hover:bg-green-600 hover:text-white hover:border-green-600"
                  }`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}