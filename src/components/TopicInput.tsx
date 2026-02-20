import React, { useState } from "react";
import { Search, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TopicInputProps {
  onGenerate: (topic: string, gradeLevel: number) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("8");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) onGenerate(topic.trim(), parseInt(gradeLevel));
  };

  const suggestions = [
    "Newton's Second Law",
    "Photosynthesis",
    "Quadratic Equations",
    "Cell Division",
    "Chemical Bonding",
    "Pythagorean Theorem",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          What do you want to learn?
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Enter any Science or Math concept and get an instant interactive lesson.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Newton's Second Law, Photosynthesis..."
            className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 border-border focus:border-primary shadow-sm"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Grade:
          </div>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => i + 5).map((g) => (
                <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="ml-auto h-11 px-8 rounded-xl font-semibold"
            style={{ background: "var(--tutor-gradient)" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Lesson
              </span>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicInput;
