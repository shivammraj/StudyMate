import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { OptionRow } from '../components/ui/OptionRow.js';
import { SkillBadge } from '../components/loop/SkillBadge.js';
import { BINARY_SEARCH_QUIZ } from '../utils/fixtures.js';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { updateSession } = useStudyMate();
  const quiz = BINARY_SEARCH_QUIZ;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<'guess' | 'fairly' | 'certain'>('fairly');
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Track answers across the quiz
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      choice: number | null;
      confidence: 'guess' | 'fairly' | 'certain';
      hinted: boolean;
      correct: boolean;
    }[]
  >([]);

  const currentQuestion = quiz.questions[questionIndex] || quiz.questions[0];
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isChecked) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsChecked(true);

    const isAnsCorrect = selectedOption === currentQuestion.correctIndex;
    const newAnswer = {
      questionId: currentQuestion.id,
      choice: selectedOption,
      confidence,
      hinted: showHint,
      correct: isAnsCorrect,
    };

    setAnswers((prev) => [...prev, newAnswer]);
  };

  const handleNextQuestion = () => {
    if (questionIndex < quiz.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setShowHint(false);
      setConfidence('fairly');
    } else {
      // Completed all questions in the quiz!
      updateSession({
        quiz,
        answers: answers.map((a) => ({
          choice: a.choice,
          hinted: a.hinted,
          confidence: a.confidence,
        })),
      });

      navigate('/quiz/binary-search/results');
    }
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setIsChecked(false);
    setShowHint(false);
  };

  return (
    <div className="max-w-[840px] mx-auto flex flex-col gap-6 py-2">
      {/* Progress & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
        <div>
          <span className="text-[12px] font-sans font-bold uppercase tracking-wider text-[var(--color-pen)]">
            Adaptive Practice • Question {questionIndex + 1} of {quiz.questions.length}
          </span>
          <h1 className="font-serif font-bold text-[22px] text-[var(--color-ink)] mt-0.5">
            {quiz.topic}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <SkillBadge skill={currentQuestion.skill} />
        </div>
      </div>

      {/* Main Question Panel */}
      <Panel className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-[12px] font-sans text-[var(--color-ink-2)] uppercase tracking-wider font-semibold">
            Scenario / Prompt
          </div>
          <p className="font-serif text-[18px] sm:text-[19px] text-[var(--color-ink)] leading-relaxed font-medium">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-2.5 my-2">
          {currentQuestion.options.map((opt: string, idx: number) => (
            <OptionRow
              key={idx}
              index={idx}
              text={opt}
              selected={selectedOption === idx}
              disabled={isChecked}
              isCorrect={idx === currentQuestion.correctIndex}
              showCorrectFeedback={isChecked}
              onClick={() => handleSelectOption(idx)}
            />
          ))}
        </div>

        {/* Confidence Selector (Master Prompt Item #15) */}
        {!isChecked && selectedOption !== null && (
          <div className="p-4 rounded-[6px] bg-[#FAF8F2] border border-[var(--color-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-pen)]" />
              <span className="text-[13px] font-sans font-semibold text-[var(--color-ink)]">
                Confidence level:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfidence('guess')}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-sans transition-colors cursor-pointer ${
                  confidence === 'guess'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : 'bg-white text-[var(--color-ink-2)] border border-[var(--color-line)]'
                }`}
              >
                Not sure (guessing)
              </button>
              <button
                type="button"
                onClick={() => setConfidence('fairly')}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-sans transition-colors cursor-pointer ${
                  confidence === 'fairly'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300 font-semibold'
                    : 'bg-white text-[var(--color-ink-2)] border border-[var(--color-line)]'
                }`}
              >
                Somewhat sure
              </button>
              <button
                type="button"
                onClick={() => setConfidence('certain')}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-sans transition-colors cursor-pointer ${
                  confidence === 'certain'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                    : 'bg-white text-[var(--color-ink-2)] border border-[var(--color-line)]'
                }`}
              >
                Very confident
              </button>
            </div>
          </div>
        )}

        {/* Hint Revelation Box */}
        {showHint && currentQuestion.hint && (
          <div className="p-4 rounded-[6px] bg-[#FFF9E6] border border-[#F0D878] text-[#7A5B00] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-sans font-bold text-[13px] uppercase tracking-wider">
                Targeted Hint:
              </span>
              <p className="text-[14px] font-sans mt-0.5 leading-relaxed">
                {currentQuestion.hint}
              </p>
            </div>
          </div>
        )}

        {/* Feedback Section after checking */}
        {isChecked && (
          <div
            className={`p-4 rounded-[6px] border flex flex-col gap-2 transition-all ${
              isCorrect
                ? 'bg-[var(--color-strong-tint)] border-[var(--color-strong)]/40 text-[var(--color-strong)]'
                : 'bg-[var(--color-weak-tint)] border-[var(--color-weak)]/40 text-[var(--color-weak)]'
            }`}
          >
            <div className="flex items-center gap-2 font-sans font-bold text-[15px]">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✓ Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Not quite. Let's look at why:</span>
                </>
              )}
            </div>

            <p className="text-[14px] font-sans text-[var(--color-ink)] leading-relaxed pl-7">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]">
          <div>
            {!isChecked && !showHint && currentQuestion.hint && (
              <Button
                variant="quiet"
                size="sm"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 text-[var(--color-ink-2)]"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Need a hint?</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isChecked ? (
              <Button
                variant="primary"
                size="md"
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
              >
                Check Answer
              </Button>
            ) : (
              <>
                {!isCorrect && (
                  <Button variant="secondary" size="md" onClick={handleTryAgain}>
                    Try Again
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>
                    {questionIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
};
