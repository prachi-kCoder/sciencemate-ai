import React, { useState, useEffect } from "react";
import { BookOpen, GraduationCap, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TopicInput from "@/components/TopicInput";
import SlideViewer from "@/components/SlideViewer";
import DoubtChat from "@/components/DoubtChat";
import Assessment from "@/components/Assessment";
import RecentLessons from "@/components/RecentLessons";
import type { Lesson, Slide, MCQ } from "@/types/lesson";

type View = "input" | "slides" | "assessment";

const Index = () => {
  const [view, setView] = useState<View>("input");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      const typed = data.map((d: any) => ({
        ...d,
        slides: d.slides as Slide[],
        mcqs: d.mcqs as MCQ[],
      }));
      setRecentLessons(typed);
    }
  };

  const handleGenerate = async (topic: string, gradeLevel: number) => {
    setIsGenerating(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ topic, gradeLevel }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to generate lesson");
      }

      const lesson = await resp.json();
      const typed: Lesson = {
        ...lesson,
        slides: lesson.slides as Slide[],
        mcqs: lesson.mcqs as MCQ[],
      };

      setCurrentLesson(typed);
      setCurrentSlideIndex(0);
      setView("slides");
      fetchLessons();

      toast({ title: "Lesson ready!", description: `"${topic}" — ${typed.slides.length} slides generated` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentSlideIndex(0);
    setView("slides");
  };

  const handleDeleteLesson = async (id: string) => {
    await supabase.from("lessons").delete().eq("id", id);
    setRecentLessons((prev) => prev.filter((l) => l.id !== id));
    if (currentLesson?.id === id) {
      setCurrentLesson(null);
      setView("input");
    }
  };

  const handleSlideNavigate = (index: number) => {
    if (index >= 0 && currentLesson && index < currentLesson.slides.length) {
      setCurrentSlideIndex(index);
    } else if (currentLesson && index >= currentLesson.slides.length) {
      setView("assessment");
    }
  };

  const gradeLevelLabel = currentLesson
    ? currentLesson.grade_level <= 12
      ? `Grade ${currentLesson.grade_level}`
      : currentLesson.grade_level === 13
      ? "AP / College Prep"
      : "Undergraduate"
    : "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 border-r bg-card transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex h-full flex-col w-72">
          {/* Sidebar header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="rounded-lg p-2" style={{ background: "var(--tutor-gradient)" }}>
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Setu-AI</h1>
              <p className="text-[11px] text-muted-foreground">Your Learning Bridge 🌉</p>
            </div>
          </div>

          {/* New lesson button */}
          <div className="p-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm"
              onClick={() => {
                setView("input");
                setCurrentLesson(null);
              }}
            >
              <BookOpen className="h-4 w-4" />
              New Lesson
            </Button>
          </div>

          {/* Recent lessons */}
          <div className="flex-1 overflow-hidden">
            <div className="px-4 py-2">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Lessons
              </h2>
            </div>
            <RecentLessons
              lessons={recentLessons}
              onSelect={handleSelectLesson}
              onDelete={handleDeleteLesson}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b px-4 py-2.5 bg-card/80 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
          {currentLesson && (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {currentLesson.topic}
                </span>
                <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-semibold shrink-0">
                  {currentLesson.subject}
                </span>
                <span className="rounded-md bg-secondary/10 text-secondary px-2 py-0.5 text-[11px] font-semibold shrink-0">
                  {gradeLevelLabel}
                </span>
              </div>
              {view === "slides" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs font-medium"
                  onClick={() => setView("assessment")}
                >
                  Take Quiz →
                </Button>
              )}
              {view === "assessment" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs font-medium"
                  onClick={() => setView("slides")}
                >
                  ← Back to Slides
                </Button>
              )}
            </>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {view === "input" && (
            <TopicInput onGenerate={handleGenerate} isLoading={isGenerating} />
          )}
          {view === "slides" && currentLesson && (
            <SlideViewer
              slides={currentLesson.slides}
              currentIndex={currentSlideIndex}
              onNavigate={handleSlideNavigate}
            />
          )}
          {view === "assessment" && currentLesson && (
            <div className="overflow-y-auto h-full">
              <Assessment
                mcqs={currentLesson.mcqs}
                onBack={() => setView("slides")}
              />
            </div>
          )}
        </div>
      </main>

      {/* Doubt Chat */}
      {currentLesson && (view === "slides" || view === "assessment") && (
        <DoubtChat
          currentSlide={currentLesson.slides[currentSlideIndex] || null}
          gradeLevel={currentLesson.grade_level}
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
        />
      )}
    </div>
  );
};

export default Index;
