import React, { useState } from "react";
import { Search, Sparkles, GraduationCap, BookOpen, Award, Lightbulb } from "lucide-react";
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
    { label: "Newton's Second Law", icon: "⚡" },
    { label: "Photosynthesis", icon: "🌱" },
    { label: "Quadratic Equations", icon: "📐" },
    { label: "Cell Division", icon: "🧬" },
    { label: "Chemical Bonding", icon: "⚛️" },
    { label: "Pythagorean Theorem", icon: "📏" },
    { label: "Linear Algebra", icon: "🔢" },
    { label: "Thermodynamics", icon: "🔥" },
  ];

  const features = [
    { icon: BookOpen, label: "Structured Slides", desc: "6 progressive concept slides" },
    { icon: Lightbulb, label: "Socratic Tutoring", desc: "AI-guided doubt resolution" },
    { icon: Award, label: "Concept Assessment", desc: "MCQ-based knowledge checks" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      {/* Hero section */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          AI-Powered Learning Platform
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Master any concept,<br />
          <span className="text-secondary">step by step.</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Enter a Science or Mathematics topic and receive an expertly structured lesson with interactive assessment — from Grade 1 through College Prep.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search any topic — e.g., Thermodynamics, Linear Algebra…"
            className="pl-12 pr-4 h-14 text-base rounded-xl border-2 border-border focus:border-primary bg-card shadow-sm"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Level</span>
          </div>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger className="w-48 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((g) => (
                <SelectItem key={g} value={g.toString()}>
                  {g <= 12 ? `Grade ${g}` : g === 13 ? "AP / College Prep" : "Undergraduate"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="ml-auto h-11 px-8 rounded-xl font-semibold text-sm"
            style={{ background: "var(--tutor-gradient)" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating…
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

      {/* Suggestion chips */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-2xl">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => setTopic(s.label)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all hover:shadow-sm"
          >
            <span className="text-xs">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Feature cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="rounded-lg bg-muted p-2.5 mb-3">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold mb-1">{f.label}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicInput;
