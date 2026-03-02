import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type CrosswordProps = {
  onComplete: () => void;
};

const solution = [
  ["O", "", "", "", "", "", "", "", "", ""],
  ["U", "", "", "", "", "", "", "", "", ""],
  ["T", "", "", "", "", "", "", "", "", ""],
  ["D", "I", "N", "N", "E", "R", "", "", "", ""],
  ["O", "", "", "", "", "A", "", "", "", ""],
  ["O", "", "", "", "", "C", "", "", "", ""],
  ["R", "", "H", "I", "K", "I", "N", "G", "", ""],
  ["", "", "", "", "", "N", "", "", "", ""],
  ["", "", "", "", "", "G", "A", "M", "E", "S"]
];

const numbers: Record<string, number> = {
  "0-0": 1,
  "3-1": 2,
  "4-6": 3,
  "6-2": 4,
  "8-4": 5,
};

export default function Crossword({ onComplete }: CrosswordProps) {
  const [grid, setGrid] = useState<(string | null)[][]>(
    solution.map(row =>
      row.map(cell => (cell === "" ? null : ""))
    )
  );

  const [message, setMessage] = useState("Solve the crossword");
  const inputsRef = useRef<(HTMLInputElement | null)[][]>([]);

  const focusCell = (row: number, col: number) => {
    inputsRef.current[row]?.[col]?.focus();
  };

  const moveNext = (row: number, col: number) => {
    const cols = solution[row].length;
    for (let c = col + 1; c < cols; c++) {
      if (solution[row][c] !== "") {
        focusCell(row, c);
        return;
      }
    }
  };

  const movePrev = (row: number, col: number) => {
    for (let c = col - 1; c >= 0; c--) {
      if (solution[row][c] !== "") {
        focusCell(row, c);
        return;
      }
    }
  };

  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[a-zA-Z]?$/.test(value)) return;
    if (grid[row][col] === null) return;

    const updated = grid.map(r => [...r]);
    updated[row][col] = value.toUpperCase();
    setGrid(updated);

    if (value !== "") {
      moveNext(row, col);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === "Backspace" && grid[row][col] === "") {
      movePrev(row, col);
    }

    if (e.key === "ArrowRight") moveNext(row, col);
    if (e.key === "ArrowLeft") movePrev(row, col);

    if (e.key === "ArrowDown") {
      for (let r = row + 1; r < solution.length; r++) {
        if (solution[r][col] !== "") {
          focusCell(r, col);
          break;
        }
      }
    }

    if (e.key === "ArrowUp") {
      for (let r = row - 1; r >= 0; r--) {
        if (solution[r][col] !== "") {
          focusCell(r, col);
          break;
        }
      }
    }
  };

  useEffect(() => {
    const complete = grid.every((row, r) =>
      row.every((cell, c) => {
        if (solution[r][c] === "") return true;
        return cell === solution[r][c];
      })
    );

    if (complete) {
      setMessage("CROSSWORD COMPLETE");
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }, [grid, onComplete]);

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-black text-white p-8 rounded-xl space-y-8 text-center"
    >
      <h2 className="text-2xl font-bold">CROSSWORD CHALLENGE</h2>
      <p>{message}</p>

      <div className="space-y-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((cell, colIndex) => {
              if (cell === null) {
                return (
                  <div key={colIndex} className="w-10 h-10 bg-black" />
                );
              }

              const correct =
                grid[rowIndex][colIndex] ===
                solution[rowIndex][colIndex];

              return (
                <div
                  key={colIndex}
                  className="relative w-10 h-10"
                >
                  {numbers[`${rowIndex}-${colIndex}`] && (
                    <span className="absolute top-0.5 left-1 text-[9px] font-semibold text-black z-20 pointer-events-none">
                      {numbers[`${rowIndex}-${colIndex}`]}
                    </span>
                  )}

                  <input
                    ref={el => {
                      if (!inputsRef.current[rowIndex]) {
                        inputsRef.current[rowIndex] = [];
                      }
                      inputsRef.current[rowIndex][colIndex] = el;
                    }}
                    maxLength={1}
                    value={cell}
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex, e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, rowIndex, colIndex)
                    }
                    className={`relative z-10 w-10 h-10 text-center font-bold border-2 outline-none
                      ${
                        cell === ""
                          ? "bg-white text-black border-black"
                          : correct
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-red-600 text-white border-red-600"
                      }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="text-left max-w-md mx-auto space-y-2">
        <p><strong>1.</strong> Opposite of indoor</p>
        <p><strong>2.</strong> Meal taken before bed time</p>
        <p><strong>3.</strong> Activity done using cars or motorcycles in an attempt to finish first</p>
        <p><strong>4.</strong> Common activity done in mountains</p>
        <p><strong>5.</strong> Activity done for entertainment purposes</p>
      </div>
    </motion.div>
  );
}