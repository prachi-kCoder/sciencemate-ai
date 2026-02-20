import React from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LatexRenderer from "@/components/LatexRenderer";
import type { Slide } from "@/types/lesson";

interface SlideViewerProps {
  slides: Slide[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ slides, currentIndex, onNavigate }) => {
  const slide = slides[currentIndex];
  if (!slide) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Slide content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Slide number */}
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Slide {currentIndex + 1} of {slides.length}
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <LatexRenderer>{slide.heading}</LatexRenderer>
          </h2>

          {/* Body */}
          <div className="text-base md:text-lg leading-relaxed text-foreground/90 mb-8">
            <LatexRenderer>{slide.body}</LatexRenderer>
          </div>

          {/* Key Terms */}
          {slide.keyTerms?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Key Terms
              </h3>
              <div className="flex flex-wrap gap-2">
                {slide.keyTerms.map((kt, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary cursor-help border border-primary/20">
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
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/50 p-6 flex items-center gap-4">
              <div className="flex-shrink-0 rounded-lg bg-secondary/10 p-3">
                <Image className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Visual Aid</p>
                <p className="text-sm text-foreground/70">{slide.visualPrompt}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-card p-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === slides.length - 1}
          className="gap-2"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlideViewer;
