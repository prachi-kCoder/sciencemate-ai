import React, { useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import LatexRenderer from "@/components/LatexRenderer";
import type { MCQ } from "@/types/lesson";

interface AssessmentProps {
  mcqs: MCQ[];
  onBack: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ mcqs, onBack }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mcqs.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.filter((a, i) => a === mcqs[i]?.correctIndex).length;
  const answeredCount = answers.filter((a) => a !== null).length;

  const reset = () => {
    setAnswers(new Array(mcqs.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Concept Assessment
        </h2>
        <p className="text-muted-foreground">
          Evaluate your understanding of the material.
        </p>
        {!submitted && (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{answeredCount} of {mcqs.length} answered</span>
            </div>
            <Progress value={(answeredCount / mcqs.length) * 100} className="h-1.5" />
          </div>
        )}
      </div>

      {/* Score card */}
      {submitted && (
        <Card className="p-6 mb-8 text-center border-2" style={{ borderColor: score === mcqs.length ? 'hsl(var(--secondary))' : score > 0 ? 'hsl(var(--accent))' : 'hsl(var(--destructive))' }}>
          <Trophy className={`h-10 w-10 mx-auto mb-3 ${score === mcqs.length ? 'text-secondary' : 'text-accent'}`} />
          <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {score}/{mcqs.length}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {score === mcqs.length ? "Perfect score! Excellent mastery." : score > mcqs.length / 2 ? "Good understanding. Review the explanations below." : "Review the material and try again."}
          </p>
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RotateCcw className="h-3.5 w-3.5" /> Retake
          </Button>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {mcqs.map((mcq, qi) => (
          <Card key={qi} className="p-6 shadow-sm">
            <p className="font-semibold mb-4 text-base">
              <span className="text-secondary mr-2 font-bold">{qi + 1}.</span>
              <LatexRenderer>{mcq.question}</LatexRenderer>
            </p>
            <div className="space-y-2">
              {mcq.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = oi === mcq.correctIndex;
                let optClass = "border-border hover:border-primary/40 hover:bg-muted/50";
                if (submitted) {
                  if (isCorrect) optClass = "border-secondary bg-secondary/5";
                  else if (selected && !isCorrect) optClass = "border-destructive bg-destructive/5";
                } else if (selected) {
                  optClass = "border-primary bg-primary/5";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => {
                      if (submitted) return;
                      setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
                    }}
                    className={`w-full text-left rounded-lg border-2 px-4 py-3 text-sm transition-all ${optClass}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        selected && !submitted ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">
                        <LatexRenderer>{opt}</LatexRenderer>
                      </span>
                      {submitted && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-secondary shrink-0" />}
                      {submitted && selected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-destructive shrink-0" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-4 rounded-lg bg-muted/50 border border-border p-4 text-sm leading-relaxed">
                <span className="font-semibold text-secondary">Explanation: </span>
                <LatexRenderer>{mcq.explanation}</LatexRenderer>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="text-sm">
          ← Back to Slides
        </Button>
        {!submitted && (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={answers.some((a) => a === null)}
            className="px-8 text-sm font-semibold"
            style={{ background: "var(--tutor-gradient)" }}
          >
            Submit Answers
          </Button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
