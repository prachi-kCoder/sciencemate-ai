import React from "react";
import { BookOpen, Clock, ArrowRight, Trash2 } from "lucide-react";
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
        <p>No recent lessons yet.</p>
        <p className="text-xs mt-1">Your lessons will appear here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group rounded-lg border border-border bg-card p-3 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onSelect(lesson)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{lesson.topic}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium">
                    {lesson.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lesson.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentLessons;
