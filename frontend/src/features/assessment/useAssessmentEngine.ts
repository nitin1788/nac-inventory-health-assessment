import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Question } from './questions';

export type AnswerMap = Record<string, number>;

const STORAGE_KEY = 'nac-assessment-answers';

function loadSavedAnswers(): AnswerMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswerMap) : {};
  } catch {
    return {};
  }
}

export interface AssessmentEngine {
  currentQuestion: Question | undefined;
  currentIndex: number;
  totalQuestions: number;
  answers: AnswerMap;
  isFirst: boolean;
  isLast: boolean;
  isCurrentAnswered: boolean;
  answerCurrent: (value: number) => void;
  goNext: () => void;
  goBack: () => void;
  clearSavedProgress: () => void;
}

/**
 * Drives the multi-step question flow: current position, answers,
 * and localStorage autosave. Takes the question list as a parameter
 * rather than importing a question bank directly, so it has no
 * dependency on where questions come from — swapping question banks
 * is just a different argument, not a change to this hook.
 */
export function useAssessmentEngine(questions: Question[]): AssessmentEngine {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => loadSavedAnswers());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const currentQuestion = questions[currentIndex];

  const answerCurrent = useCallback(
    (value: number) => {
      if (!currentQuestion) return;
      setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
    },
    [currentQuestion]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  }, [questions.length]);

  const goBack = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const clearSavedProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentIndex(0);
  }, []);

  const isCurrentAnswered = useMemo(
    () => (currentQuestion ? answers[currentQuestion.id] !== undefined : false),
    [answers, currentQuestion]
  );

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    answers,
    isFirst: currentIndex === 0,
    isLast: currentIndex === questions.length - 1,
    isCurrentAnswered,
    answerCurrent,
    goNext,
    goBack,
    clearSavedProgress,
  };
}
