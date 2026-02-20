import React, { useState } from "react";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">🧪 Concept Check</h2>
        <p className="text-muted-foreground">Test your understanding of the lesson</p>
      </div>

      <div className="space-y-6">
        {mcqs.map((mcq, qi) => (
          <Card key={qi} className="p-6">
            <p className="font-semibold mb-4">
              <span className="text-primary mr-2">Q{qi + 1}.</span>
              <LatexRenderer>{mcq.question}</LatexRenderer>
            </p>
            <div className="space-y-2">
              {mcq.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = oi === mcq.correctIndex;
                let optClass = "border-border hover:border-primary/50 hover:bg-muted/50";
                if (submitted) {
                  if (isCorrect) optClass = "border-green-500 bg-green-50 dark:bg-green-950/30";
                  else if (selected && !isCorrect) optClass = "border-destructive bg-red-50 dark:bg-red-950/30";
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
                      <span className="flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <LatexRenderer>{opt}</LatexRenderer>
                      {submitted && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600 shrink-0" />}
                      {submitted && selected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-destructive shrink-0" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-3 rounded-lg bg-muted p-3 text-sm">
                <span className="font-medium">Explanation: </span>
                <LatexRenderer>{mcq.explanation}</LatexRenderer>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>← Back to Slides</Button>
        {!submitted ? (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={answers.some((a) => a === null)}
            className="px-8"
            style={{ background: "var(--tutor-gradient)" }}
          >
            Submit Answers
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold">
              {score}/{mcqs.length} Correct
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
