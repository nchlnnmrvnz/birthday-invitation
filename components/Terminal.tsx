"use client";

import { useState, useRef, useEffect } from "react";
import { fakeFS, File, Folder } from "@/lib/fakeFS";
import { ConfigCategory, getConfig, updateConfig } from "@/services/config";
import { fetchGreeting } from "@/services/greeting";

export default function Terminal({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const [history, setHistory] = useState<React.ReactNode[]>([
    renderPrompt([], "Welcome ddemayo"),
    renderPrompt([], "Type a command to continue"),
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const [cwd, setCwd] = useState<Folder>(fakeFS);
  const [path, setPath] = useState<string[]>([]);
  const [prevPath, setPrevPath] = useState<string[] | null>(null);

  const [awaitingPassword, setAwaitingPassword] = useState<{
    content: string;
    password: string;
  } | null>(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [configDeleted, setConfigDeleted] = useState(false);

  const [config, setConfig] = useState<Record<ConfigCategory, boolean>>({
    [ConfigCategory.MARCH22_VIEWED]: false,
    [ConfigCategory.MARCH25_VIEWED]: false,
    [ConfigCategory.JANFEB_UNLOCKED]: false,
  });

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
    setIsUserScrolling(false);
  }, [input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isUserScrolling) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "auto",
      });
    }
  }, [history, awaitingPassword]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      const container = containerRef.current;
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const threshold = 20;
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    setIsUserScrolling(!atBottom);
};

  useEffect(() => {
    async function fetchConfigs() {
      const updated: Record<ConfigCategory, boolean> = { ...config };
      for (const cat of Object.values(ConfigCategory)) {
        try {
          const value = await getConfig(cat);
          updated[cat] = value;
        } catch (err) {
          console.error("Failed to fetch config", err);
        }
      }
      setConfig(updated);
    }
    fetchConfigs();
  }, []);

  function renderPrompt(path: string[], cmd?: string) {
    return (
      <div>
        <span className="text-green-400">ddemayo@ubuntu:</span>
        <span className="text-blue-400">
          ~{path.length ? "/" + path.join("/") : ""}
        </span>
        <span className="text-white">$</span>
        {cmd && <span className="text-white"> {cmd}</span>}
      </div>
    );
  }

  function resolvePath(parts: string[]): File | Folder | undefined {
    let current: File | Folder = fakeFS;
    for (const p of parts) {
      if (current.type !== "folder") return undefined;
      current = current.children[p];
      if (!current) return undefined;
    }
    return current;
  }

  function getMatches(prefix: string): string[] {
    if (cwd.type !== "folder") return [];
    return Object.keys(cwd.children)
      .filter((name) => isFolderUnlocked(name))
      .filter((name) => name.startsWith(prefix));
  }

  function isFolderUnlocked(name: string): boolean {
    if (name === "January" || name === "February") {
      return config[ConfigCategory.JANFEB_UNLOCKED];
    }
    return true;
  }

  async function runCommand(cmd: string) {
    if (!cmd) return;

    setCmdHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
    setHistory((h) => [...h, renderPrompt(path, cmd)]);

    const args = cmd.split(" ");
    const base = args[0];

    switch (base) {
      case "clear":
        setHistory([]);
        return;

      case "help": {
        const topic = args[1];

        const hiddenUnlocked =
          config[ConfigCategory.MARCH22_VIEWED] && !configDeleted;

        const supportedCommands = [
          "ls",
          "cd",
          "pwd",
          "cat",
          "history",
          "clear"
        ];

        if (hiddenUnlocked) {
          supportedCommands.push("rm");
        }

        if (!topic) {
          setHistory((h) => [
            ...h,
            <div className="text-white">GNU bash, version 1.4.3(24)-release (x86_64-pc-linux-gnu)</div>,
            <div className="text-white">These shell commands are defined internally. Type 'help' to see this list.</div>,
            <div className="text-white">Type 'help name' to find out more about the function 'name'.</div>,
            <div className="text-white">These shell commands are defined internally. Type 'help' to see this list.</div>,
            <div className="text-green-400">
              {supportedCommands.join("   ")}
            </div>,
          ]);
          return;
        }

        const helpMap: Record<string, string[]> = {
          ls: [
            "ls: ls [-a]",
            "    List directory contents.",
            "    [-a]    shows hidden files and directories",
          ],
          cd: [
            "cd: cd [dir]",
            "    Change the shell working directory.",                                
            "    [dir]    the directory name",
          ],
          pwd: [
            "pwd: pwd",
            "    Print the name of the current working directory.",
          ],
          cat: [
            "cat: cat [file]",
            "    Display file contents.",
            "    [file]    the file name",
          ],
          history: [
            "history: history",
            "    Display the command history.",
          ],
          clear: [
            "clear: clear",
            "    Clear the terminal screen.",
          ],
          rm: [
            "rm: rm [file]",
            "    Remove files.",
            "    [file]    the file name",
          ],
        };

        if (!helpMap[topic] || !supportedCommands.includes(topic)) {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">
              {`bash: 'help' - no help topics match '${topic}'`}
            </div>,
          ]);
          return;
        }

        setHistory((h) => [
          ...h,
          ...helpMap[topic].map((line, i) => (
            <div key={i} className="text-white">{line}</div>
          )),
        ]);

        return;
      }

      case "history":
        setHistory((h) => [
          ...h,
          ...cmdHistory.map((c, i) => (
            <div key={i} className="text-white">{`${i + 1}  ${c}`}</div>
          )),
        ]);
        return;

      case "pwd":
        setHistory((h) => [
          ...h,
          <div className="text-white">/{path.join("/")}</div>,
        ]);
        return;

      case "ls": {
        if (args.length > 2) {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">{`bash: 'ls' - invalid argument`}</div>,
          ]);
          return;
        }

        const showHidden = args.includes("-a");

        let items = Object.entries(cwd.children);

        if (!config[ConfigCategory.JANFEB_UNLOCKED]) {
          items = items.filter(([name]) => name !== "January" && name !== "February");
        }

        if (showHidden && config[ConfigCategory.MARCH22_VIEWED] && !configDeleted) {
          items = [...items, [".config", { type: "file" } as File]];
        }

        const lines: React.ReactNode[] = [];
        for (let i = 0; i < items.length; i += 7) {
          const row = items.slice(i, i + 7).map(([name, node]) => (
            <span
              key={name}
              className={
                node.type === "folder"
                  ? "text-blue-400"
                  : name.startsWith(".")
                  ? "text-gray-500"
                  : "text-white"
              }>
              {name}
            </span>
          ));
          lines.push(<div key={i} className="space-x-4">{row}</div>);
        }

        setHistory((h) => [...h, ...lines]);
        return;
      }

      case "cd": {
        const target = args[1];

        if (!target || target === "~") {
          setPrevPath(path);
          setPath([]);
          setCwd(fakeFS);
          return;
        }

        if (target === "-") {
          if (!prevPath) return;

          const resolved = resolvePath(prevPath);
          if (resolved && resolved.type === "folder") {
            const current = [...path];
            setPath(prevPath);
            setCwd(resolved);
            setPrevPath(current);

            setHistory((h) => [
              ...h,
              <div className="text-white">/{prevPath.join("/")}</div>,
            ]);
          }
          return;
        }

        let segments: string[];
        let newPath: string[];

        if (target.startsWith("/")) {
          segments = target.split("/").filter(Boolean);
          newPath = [];
        }
        else if (target.startsWith("~/")) {
          segments = target.replace("~/", "").split("/").filter(Boolean);
          newPath = [];
        }
        else {
          segments = target.split("/").filter(Boolean);
          newPath = [...path];
        }

        for (const segment of segments) {
          if (segment === ".") continue;

          if (segment === "..") {
            if (newPath.length > 0) newPath.pop();
            continue;
          }

          const resolved = resolvePath(newPath);

          if (!resolved || resolved.type !== "folder") {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cd: ${target}' - No such file or directory`}
              </div>,
            ]);
            return;
          }

          const next = resolved.children[segment];

          if (!next) {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cd: ${target}' - No such file or directory`}
              </div>,
            ]);
            return;
          }

          if (next.type !== "folder") {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cd: ${target}' - Not a directory`}
              </div>,
            ]);
            return;
          }

          if (
            !config[ConfigCategory.JANFEB_UNLOCKED] &&
            (segment === "January" || segment === "February")
          ) {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cd: ${segment}' - Permission denied`}
              </div>,
            ]);
            return;
          }

          newPath.push(segment);
        }

        const finalResolved = resolvePath(newPath);

        if (finalResolved && finalResolved.type === "folder") {
          setPrevPath(path);
          setPath(newPath);
          setCwd(finalResolved);
        }

        return;
      }

      case "cat": {
        const target = args[1];
        if (!target) return;

        let segments: string[];
        let workingPath: string[];

        if (target.startsWith("/")) {
          segments = target.split("/").filter(Boolean);
          workingPath = [];
        } else if (target.startsWith("~/")) {
          segments = target.replace("~/", "").split("/").filter(Boolean);
          workingPath = [];
        } else {
          segments = target.split("/").filter(Boolean);
          workingPath = [...path];
        }

        if (segments.length === 0) return;

        const filename = segments.pop()!;

        for (const segment of segments) {
          if (segment === ".") continue;

          if (segment === "..") {
            if (workingPath.length > 0) workingPath.pop();
            continue;
          }

          const resolved = resolvePath(workingPath);

          if (!resolved || resolved.type !== "folder") {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cat ${target}' - No such file or directory`}
              </div>,
            ]);
            return;
          }

          const next = resolved.children[segment];

          if (!next || next.type !== "folder") {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                {`bash: 'cat ${target}' - No such file or directory`}
              </div>,
            ]);
            return;
          }

          workingPath.push(segment);
        }

        const monthName = workingPath[workingPath.length - 1];
        if (!monthName) {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">
              {`bash: 'cat ${target}' - Invalid path`}
            </div>,
          ]);
          return;
        }

        const day = parseInt(filename.split(".")[0], 10);
        if (isNaN(day)) {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">
              {`bash: 'cat ${target}' - Invalid file`}
            </div>,
          ]);
          return;
        }

        if (monthName.toUpperCase() === "MARCH") {
          const today = new Date();
          const currentMonth = today.getMonth();
          const currentDay = today.getDate();

          if (currentMonth < 2 ||(currentMonth === 2 && currentDay < day)) {
            setHistory((h) => [
              ...h,
              <div className="text-red-400">
                Access denied. Please wait for the day to come.
              </div>,
            ]);
            return;
          }
        }

        try {
          const greeting = await fetchGreeting(monthName.toUpperCase(), day);

          setAwaitingPassword({
            content: greeting.message,
            password: greeting.password,
          });

          setPasswordInput("");

          if (monthName.toUpperCase() === "MARCH" && day === 22) {
            if (!config[ConfigCategory.MARCH22_VIEWED]) {
              await updateConfig(ConfigCategory.MARCH22_VIEWED, true);
              setConfig((prev) => ({
                ...prev,
                [ConfigCategory.MARCH22_VIEWED]: true,
              }));
            }
          }

          if (monthName.toUpperCase() === "MARCH" && day === 25) {
            if (!config[ConfigCategory.MARCH25_VIEWED]) {
              await updateConfig(ConfigCategory.MARCH25_VIEWED, true);
              await updateConfig(ConfigCategory.JANFEB_UNLOCKED, true);

              setConfig((prev) => ({
                ...prev,
                [ConfigCategory.MARCH25_VIEWED]: true,
                [ConfigCategory.JANFEB_UNLOCKED]: true,
              }));
            }
          }

        } catch (err) {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">
              {`bash: 'cat ${target}' - No such file or directory`}
            </div>,
          ]);
        }

        return;
      }

      case "rm": {
        const filename = args[1];
        if (filename === ".config" && config[ConfigCategory.MARCH22_VIEWED] && !configDeleted) {
          setConfigDeleted(true);
          setHistory((h) => [
            ...h,
            <div className="text-red-400">Hidden file '.config' deleted.</div>,
          ]);
          return;
        }

        setHistory((h) => [
          ...h,
          <div className="text-red-400">{`bash: 'rm ${filename}' - No such file`}</div>,
        ]);
        return;
      }

      case "start":
        setHistory((h) => [
          ...h,
          <div className="text-white">Launching invitation...</div>,
        ]);
        setTimeout(onDone, 500);
        return;

      default:
        setHistory((h) => [
          ...h,
          <div className="text-red-400">{`bash: '${cmd}' command not found`}</div>,
        ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    endRef.current?.scrollIntoView({ behavior: "auto" });
    setIsUserScrolling(false);

    if (awaitingPassword) {
      e.preventDefault();

      if (e.key === "Enter") {
        if (passwordInput === awaitingPassword.password) {
          setHistory((h) => [
          ...h,
          <div className="text-white whitespace-pre-wrap">
            {awaitingPassword.content}
          </div>,
        ]);
        } else {
          setHistory((h) => [
            ...h,
            <div className="text-red-400">Incorrect password.</div>,
          ]);
        }

        setAwaitingPassword(null);
        setPasswordInput("");
      } else if (e.key === "Backspace") {
        setPasswordInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setPasswordInput((prev) => prev + e.key);
      }

      return;
    }

    if (e.key === "Enter") {
      runCommand(input.trim());
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const newIndex = historyIndex === null ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(cmdHistory[newIndex]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= cmdHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const args = input.split(" ");
      const lastWord = args[args.length - 1];
      const matches = getMatches(lastWord);

      if (matches.length === 1) {
        const node = cwd.type === "folder" ? cwd.children[matches[0]] : null;
        args[args.length - 1] = node?.type === "folder" ? matches[0] + "/" : matches[0];
        setInput(args.join(" "));
      } else if (matches.length > 1) {
        setHistory((h) => [
          ...h,
          <div key={h.length} className="text-white">{matches.join("  ")}</div>,
        ]);
      }
    }
  }

  return (
  <div
    className="h-screen flex flex-col bg-black font-mono p-6 overflow-y-scroll justify-center"
    ref={containerRef}
    onClick={() => {
      inputRef.current?.focus();
      if (!isUserScrolling) {
        const container = containerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }}
    >
      <div className="whitespace-pre-wrap w-full max-w-sm overflow-y-scroll mx-auto">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {awaitingPassword ? (
          <div className="text-yellow-400">Password:</div>
        ) : (
          <div>
            <span className="text-green-400">ddemayo@ubuntu:</span>
            <span className="text-blue-400">~{path.length ? "/" + path.join("/") : ""}</span>
            <span className="text-white">$ </span>
            <div className="text-white inline-block">
              {input
                .split("")
                .map((char, i) =>
                  i === cursorIndex ? (
                    <span key={i} className="bg-white text-black">
                      {char || " "}
                    </span>
                  ) : (
                    <span key={i}>{char}</span>
                  )
                )}
              {cursorIndex === input.length && (
                <span className="bg-white text-black"> </span>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        autoFocus
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setCursorIndex(e.target.selectionStart ?? 0);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
          endRef.current?.scrollIntoView({ behavior: "auto" });
          setIsUserScrolling(false);
          setTimeout(() => {
            setCursorIndex(inputRef.current?.selectionStart ?? 0);
          }, 0);
        }}     
        className="absolute opacity-0 pointer-events-none"
      />
    <div ref={endRef} />
    </div>
  );
}