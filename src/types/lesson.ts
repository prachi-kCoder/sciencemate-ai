export interface Slide {
  heading: string;
  body: string;
  keyTerms: { term: string; definition: string }[];
  visualPrompt: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  topic: string;
  subject: string;
  grade_level: number;
  slides: Slide[];
  mcqs: MCQ[];
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
