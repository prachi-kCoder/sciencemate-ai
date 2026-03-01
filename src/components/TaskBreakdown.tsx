import React, { useState, useEffect, useCallback } from "react";
import { ListChecks, Play, Pause, RotateCcw, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Slide } from "@/types/lesson";

interface Step {
  label: string;
  done: boolean;
}

interface TaskBreakdownProps {
  slides: Slide[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/** Generates a 3-step checklist from the current slide */
function buildSteps(slide: Slide): Step[] {
  const steps: Step[] = [];

  // Step 1: Read the concept
  steps.push({ label: `Read: ${slide.heading}`, done: false });

  // Step 2: Key terms
  if (slide.keyTerms?.length > 0) {
    const terms = slide.keyTerms.slice(0, 3).map((kt) => kt.term).join(", ");
    steps.push({ label: `Learn key terms: ${terms}`, done: false });
  } else {
    steps.push({ label: "Summarize the main idea in your own words", done: false });
  }

  // Step 3: Visual / recall
  steps.push({ label: "Quick recall — close your eyes & explain it!", done: false });

  return steps;
}

const TIMER_SECONDS = 120; // 2 min per step

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ slides, currentIndex, onNavigate }) => {
  const slide = slides[currentIndex];
  const [steps, setSteps] = useState<Step[]>(() => buildSteps(slide));
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [activeStep, setActiveStep] = useState(0);

  // Reset steps when slide changes
  useEffect(() => {
    setSteps(buildSteps(slides[currentIndex]));
    setActiveStep(0);
    setSecondsLeft(TIMER_SECONDS);
    setTimerRunning(false);
  }, [currentIndex, slides]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, secondsLeft]);

  // Auto-pause when timer reaches 0
  useEffect(() => {
    if (secondsLeft <= 0 && timerRunning) {
      setTimerRunning(false);
    }
  }, [secondsLeft, timerRunning]);

  const toggleStep = useCallback((idx: number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s))
    );
  }, []);

  const resetTimer = useCallback(() => {
    setSecondsLeft(TIMER_SECONDS);
    setTimerRunning(false);
  }, []);

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const timerProgress = ((TIMER_SECONDS - secondsLeft) / TIMER_SECONDS) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent/15 p-1.5">
            <ListChecks className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Task Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">One step at a time — you've got this! 💪</p>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {completedCount}/{steps.length} done
        </span>
      </div>

      {/* Steps checklist */}
      <div className="space-y-2 mb-4">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-all border ${
              step.done
                ? "bg-secondary/10 border-secondary/20 text-muted-foreground line-through"
                : i === activeStep
                ? "bg-primary/5 border-primary/20 text-foreground font-medium"
                : "bg-transparent border-transparent text-foreground/70 hover:bg-muted"
            }`}
          >
            {step.done ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-secondary shrink-0" />
            ) : (
              <Circle className="h-4.5 w-4.5 text-muted-foreground/40 shrink-0" />
            )}
            <span className="leading-snug">{step.label}</span>
          </button>
        ))}
      </div>

      {/* Visual Timer */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">Focus Timer</span>
          </div>
          <span className={`text-lg font-mono font-bold tabular-nums ${secondsLeft <= 10 && timerRunning ? "text-destructive animate-pulse" : "text-foreground"}`}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
        <Progress value={timerProgress} className="h-1.5 mb-2" />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timerRunning ? "outline" : "default"}
            className="gap-1.5 text-xs flex-1"
            onClick={() => {
              if (secondsLeft <= 0) setSecondsLeft(TIMER_SECONDS);
              setTimerRunning(!timerRunning);
            }}
          >
            {timerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {timerRunning ? "Pause" : secondsLeft <= 0 ? "Restart" : "Start"}
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs" onClick={resetTimer}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>

      {/* All done */}
      {allDone && (
        <div className="mt-4 rounded-lg bg-secondary/10 border border-secondary/20 p-3 text-center">
          <p className="text-sm font-medium text-secondary">🎉 Great job! You've completed all steps!</p>
          {currentIndex < slides.length - 1 && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs"
              onClick={() => onNavigate(currentIndex + 1)}
            >
              Next Slide →
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBreakdown;
