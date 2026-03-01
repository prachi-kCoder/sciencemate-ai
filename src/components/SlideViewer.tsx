import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image, BookOpen, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LatexRenderer from "@/components/LatexRenderer";
import TaskBreakdown from "@/components/TaskBreakdown";
import type { Slide } from "@/types/lesson";

interface SlideViewerProps {
  slides: Slide[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ slides, currentIndex, onNavigate }) => {
  const slide = slides[currentIndex];
  const [showBreakdown, setShowBreakdown] = useState(false);
  if (!slide) return null;

  const progress = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div className="flex h-full">
      {/* Table of contents sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r bg-card/50 flex-shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Contents
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all mb-0.5 ${
                i === currentIndex
                  ? "bg-primary/10 text-primary font-medium border border-primary/20"
                  : i < currentIndex
                  ? "text-muted-foreground hover:bg-muted"
                  : "text-foreground/70 hover:bg-muted"
              }`}
            >
              <span className="flex items-start gap-2.5">
                <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                  i < currentIndex
                    ? "bg-secondary/20 text-secondary"
                    : i === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i < currentIndex ? "✓" : i + 1}
                </span>
                <span className="line-clamp-2 leading-snug">{s.heading}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main slide area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Progress bar */}
        <div className="px-6 pt-4 pb-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium">Slide {currentIndex + 1} of {slides.length}</span>
            <div className="flex items-center gap-3">
              <Button
                variant={showBreakdown ? "default" : "outline"}
                size="sm"
                className="gap-1.5 text-[11px] h-7 px-2.5"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                <ListChecks className="h-3 w-3" />
                Task Breakdown
              </Button>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Task Breakdown for neurodiversity support */}
            {showBreakdown && (
              <TaskBreakdown slides={slides} currentIndex={currentIndex} onNavigate={onNavigate} />
            )}
            {/* Heading */}
            <h2 className="text-2xl md:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              <LatexRenderer>{slide.heading}</LatexRenderer>
            </h2>

            {/* Body */}
            <div className="slide-prose text-base md:text-lg leading-relaxed text-foreground/85 mb-8">
              <LatexRenderer>{slide.body}</LatexRenderer>
            </div>

            {/* Key Terms */}
            {slide.keyTerms?.length > 0 && (
              <div className="mb-8 rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-secondary" />
                  Key Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {slide.keyTerms.map((kt, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center rounded-lg bg-primary/8 px-3 py-1.5 text-sm font-medium text-primary cursor-help border border-primary/15 hover:bg-primary/12 transition-colors">
                          <LatexRenderer>{kt.term}</LatexRenderer>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs text-sm">
                        <LatexRenderer>{kt.definition}</LatexRenderer>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Prompt */}
            {slide.visualPrompt && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-accent/15 p-2.5">
                  <Image className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Visual Reference</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{slide.visualPrompt}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t bg-card px-6 py-3 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="gap-2 text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          {/* Progress dots — mobile only */}
          <div className="flex gap-1.5 lg:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : i < currentIndex
                    ? "w-2 bg-secondary/50"
                    : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => onNavigate(currentIndex + 1)}
            className="gap-2 text-sm"
            style={currentIndex === slides.length - 1 ? { background: "var(--tutor-gradient)" } : undefined}
          >
            {currentIndex === slides.length - 1 ? "Take Quiz" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;
