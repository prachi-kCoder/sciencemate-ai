import React from "react";
import { BookOpen, Clock, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/types/lesson";

interface RecentLessonsProps {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

const RecentLessons: React.FC<RecentLessonsProps> = ({ lessons, onSelect, onDelete }) => {
  if (lessons.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p>No lessons yet.</p>
        <p className="text-xs mt-1">Generated lessons appear here.</p>
      </div>
    );
  }

  const gradeLabel = (g: number) =>
    g <= 12 ? `Gr. ${g}` : g === 13 ? "AP" : "UG";

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group rounded-lg border border-transparent hover:border-border bg-transparent hover:bg-muted/50 p-3 transition-all cursor-pointer"
            onClick={() => onSelect(lesson)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate leading-snug">{lesson.topic}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                    {lesson.subject}
                  </span>
                  <span className="rounded bg-secondary/10 text-secondary px-1.5 py-0.5 font-medium">
                    {gradeLabel(lesson.grade_level)}
                  </span>
                  <span className="flex items-center gap-0.5 ml-auto">
                    <Clock className="h-3 w-3" />
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lesson.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentLessons;
