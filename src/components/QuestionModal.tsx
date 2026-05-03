"use client";

import { useState, useEffect, useRef } from "react";
import type { Question, ABCDQuestion, NumericalQuestion } from "@/lib/types";

interface QuestionModalProps {
  question: Question;
  territoryName: string;
  isAttack: boolean;
  onAnswer: (answer: string | number, responseTimeMs: number) => void;
  disabled?: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuestionModal({
  question,
  territoryName,
  isAttack,
  onAnswer,
  disabled = false,
}: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [numericalInput, setNumericalInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    setSelected(null);
    setNumericalInput("");
    setSubmitted(false);
  }, [question.id]);

  const handleABCDSelect = (idx: number) => {
    if (disabled || submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;
    const elapsed = Date.now() - startTimeRef.current;

    if (question.type === "abcd") {
      if (selected === null) return;
      setSubmitted(true);
      onAnswer(selected, elapsed);
    } else {
      const val = parseFloat(numericalInput);
      if (isNaN(val)) return;
      setSubmitted(true);
      onAnswer(val, elapsed);
    }
  };

  const abcdQ = question.type === "abcd" ? (question as ABCDQuestion) : null;
  const numQ = question.type === "numerical" ? (question as NumericalQuestion) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {isAttack ? (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                ⚔️ ÚTOK
              </span>
            ) : (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                🏳️ OBSAZENÍ
              </span>
            )}
            <span className="text-gray-400 text-sm font-medium">{territoryName}</span>
            <span className="ml-auto text-xs text-gray-500 uppercase tracking-wider">
              {question.type === "abcd" ? "ABCD" : "Číselná"}
            </span>
          </div>
          <p className="text-white text-lg font-semibold leading-snug">{question.text}</p>
        </div>

        {/* ABCD Options */}
        {abcdQ && (
          <div className="grid grid-cols-1 gap-2 mb-5">
            {abcdQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleABCDSelect(idx)}
                disabled={disabled || submitted}
                className={[
                  "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  selected === idx
                    ? "border-blue-400 bg-blue-900/40 text-white"
                    : "border-gray-700 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-750",
                  disabled || submitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shrink-0",
                    selected === idx
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300",
                  ].join(" ")}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Numerical input */}
        {numQ && (
          <div className="mb-5">
            <label className="block text-gray-400 text-sm mb-2">
              Tvá odpověď ({numQ.unit}):
            </label>
            <input
              type="number"
              value={numericalInput}
              onChange={(e) => setNumericalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={disabled || submitted}
              placeholder={`Zadej číslo (${numQ.unit})`}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-400 disabled:opacity-60"
              autoFocus
            />
            <p className="text-gray-500 text-xs mt-1">
              Tip: přijatelná odchylka ± {numQ.tolerance} {numQ.unit}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={
            disabled ||
            submitted ||
            (question.type === "abcd" ? selected === null : numericalInput.trim() === "")
          }
          className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
        >
          {submitted ? "Odesláno…" : "Potvrdit odpověď"}
        </button>
      </div>
    </div>
  );
}
