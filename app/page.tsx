"use client";
import { useState } from "react";
import Terminal from "../components/Terminal";
import BirthdayInvitation from "../components/BirthdayInvitation";

export default function Page() {
  const [started, setStarted] = useState(false);

  return started ? (
    <BirthdayInvitation />
  ) : (
    <Terminal onDone={() => setStarted(true)} />
  );
}
