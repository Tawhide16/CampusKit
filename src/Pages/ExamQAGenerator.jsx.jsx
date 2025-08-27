import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Download, Upload, Plus, Trash2, Shuffle, Play, Square, Settings, Check, X, FileText, Filter } from "lucide-react";

// If you're using shadcn/ui, these imports will work. If not, the Tailwind-only
// fallback components defined below will be used automatically.
let Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Tabs, TabsList, TabsTrigger, TabsContent, Switch, Badge, Progress, Separator, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger;

try {
  // These will resolve only if shadcn/ui exists in your project
  // (and your alias `@/components/ui/*` is configured). If not available,
  // the catch will define minimal Tailwind fallbacks.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({
    Button,
  } = require("@/components/ui/button"));
  ({ Card, CardContent, CardHeader, CardTitle } = require("@/components/ui/card"));
  ({ Input } = require("@/components/ui/input"));
  ({ Textarea } = require("@/components/ui/textarea"));
  ({ Label } = require("@/components/ui/label"));
  ({ Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = require("@/components/ui/select"));
  ({ Tabs, TabsList, TabsTrigger, TabsContent } = require("@/components/ui/tabs"));
  ({ Switch } = require("@/components/ui/switch"));
  ({ Badge } = require("@/components/ui/badge"));
  ({ Progress } = require("@/components/ui/progress"));
  ({ Separator } = require("@/components/ui/separator"));
  ({ Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } = require("@/components/ui/tooltip"));
} catch (e) {
  // Tailwind-only minimal fallbacks so the component works anywhere
  const F = ({ className = "", as: Tag = "div", ...p }) => <Tag className={className} {...p} />;
  Button = ({ className = "", variant = "default", ...p }) => (
    <button
      className={`px-3 py-2 rounded-2xl shadow text-sm font-medium transition active:scale-[.98] disabled:opacity-50 ${
        variant === "outline" ? "border" : "bg-black text-white"
      } ${className}`}
      {...p}
    />
  );
  Card = ({ className = "", ...p }) => <F className={`rounded-2xl border shadow-sm ${className}`} {...p} />;
  CardHeader = ({ className = "", ...p }) => <F className={`p-4 ${className}`} {...p} />;
  CardTitle = ({ className = "", ...p }) => <F className={`text-lg font-semibold ${className}`} {...p} />;
  CardContent = ({ className = "", ...p }) => <F className={`p-4 ${className}`} {...p} />;
  Input = ({ className = "", ...p }) => <input className={`w-full rounded-xl border p-2 ${className}`} {...p} />;
  Textarea = ({ className = "", ...p }) => <textarea className={`w-full rounded-xl border p-2 ${className}`} {...p} />;
  Label = ({ className = "", ...p }) => <label className={`text-sm text-gray-600 ${className}`} {...p} />;
  const SelectBase = ({ value, onValueChange, children }) => (
    <div className="relative">
      <select className="w-full rounded-xl border p-2" value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
  Select = ({ children, ...p }) => <SelectBase {...p}>{children}</SelectBase>;
  SelectTrigger = ({ children }) => <>{children}</>;
  SelectValue = ({ placeholder }) => <option value="">{placeholder}</option>;
  SelectContent = ({ children }) => <>{children}</>;
  SelectItem = ({ children, value }) => <option value={value}>{children}</option>;
  Tabs = ({ value, onValueChange, children }) => <div data-tabs value={value} onChange={onValueChange}>{children}</div>;
  TabsList = ({ className = "", ...p }) => <div className={`flex gap-2 ${className}`} {...p} />;
  TabsTrigger = ({ value, onClick, children }) => (
    <Button variant="outline" onClick={onClick}>{children}</Button>
  );
  TabsContent = ({ children }) => <div className="mt-4">{children}</div>;
  Switch = ({ checked, onCheckedChange }) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  );
  Badge = ({ className = "", ...p }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${className}`} {...p} />;
  Progress = ({ value }) => (
    <div className="h-2 w-full rounded bg-gray-200"><div className="h-2 rounded bg-black" style={{ width: `${value}%` }} /></div>
  );
  Separator = ({ className = "", ...p }) => <div className={`h-px w-full bg-gray-200 ${className}`} {...p} />;
  TooltipProvider = ({ children }) => <>{children}</>;
  Tooltip = ({ children }) => <>{children}</>;
  TooltipTrigger = ({ children }) => <>{children}</>;
  TooltipContent = ({ children }) => <span className="ml-2 text-xs text-gray-500">{children}</span>;
}

// ---------------------- Utils & Constants ----------------------
const LS_KEY = "qa-bank-v1";
const LS_SETTINGS_KEY = "qa-settings-v1";

const DEFAULT_BANK = [
  {
    id: uuidv4(),
    type: "mcq",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)",
    explanation: "Binary search halves the search space each step.",
    topic: "DSA",
    difficulty: "easy",
  },
  {
    id: uuidv4(),
    type: "mcq",
    question: "Which HTTP method is idempotent by design?",
    options: ["POST", "PATCH", "PUT", "CONNECT"],
    answer: "PUT",
    explanation: "Multiple PUTs with the same payload result in the same state.",
    topic: "Web",
    difficulty: "medium",
  },
  {
    id: uuidv4(),
    type: "short",
    question: "Name the ACID property that ensures a transaction's changes are permanent.",
    answer: "Durability",
    explanation: "Once committed, changes survive failures.",
    topic: "DBMS",
    difficulty: "easy",
  },
  {
    id: uuidv4(),
    type: "mcq",
    question: "In Go, which keyword starts a lightweight thread?",
    options: ["thread", "go", "spawn", "async"],
    answer: "go",
    explanation: "The 'go' keyword starts a goroutine.",
    topic: "Golang",
    difficulty: "easy",
  },
];

const DIFFICULTIES = ["easy", "medium", "hard"];

const cx = (...classes) => classes.filter(Boolean).join(" ");

const loadFromLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => loadFromLS(key, initialValue));
  useEffect(() => saveToLS(key, state), [key, state]);
  return [state, setState];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------- Main Component ----------------------
export default function ExamQAGenerator() {
  const [bank, setBank] = useLocalStorage(LS_KEY, DEFAULT_BANK);
  const topics = useMemo(() => Array.from(new Set(bank.map((q) => q.topic))).sort(), [bank]);

  const [settings, setSettings] = useLocalStorage(LS_SETTINGS_KEY, {
    examMode: false,
    shuffle: true,
    showExplanations: true,
  });

  const [tab, setTab] = useState("practice");

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-5xl p-4">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white"><FileText size={18} /></div>
            <h1 className="text-2xl font-bold">Exam Q&A Generator</h1>
            <Badge className="ml-2">Local JSON</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setTab("practice")}><Play size={16}/> Practice</Button>
            <Button variant="outline" className="gap-2" onClick={() => setTab("build")}><Plus size={16}/> Build Bank</Button>
            <Button variant="outline" className="gap-2" onClick={() => setTab("import")}><Upload size={16}/> Import/Export</Button>
            <Button variant="outline" className="gap-2" onClick={() => setTab("settings")}><Settings size={16}/> Settings</Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {tab === "practice" && (
            <motion.div key="practice" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <PracticePanel bank={bank} settings={settings} />
            </motion.div>
          )}
          {tab === "build" && (
            <motion.div key="build" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <BuilderPanel bank={bank} setBank={setBank} />
            </motion.div>
          )}
          {tab === "import" && (
            <motion.div key="import" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <ImportExportPanel bank={bank} setBank={setBank} />
            </motion.div>
          )}
          {tab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <SettingsPanel settings={settings} setSettings={setSettings} setBank={setBank} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Pro tip: Export your bank as JSON and share with friends. Collaborative sweating = smarter sweating 
        </footer>
      </div>
    </TooltipProvider>
  );
}

// ---------------------- Practice Panel ----------------------
function PracticePanel({ bank, settings }) {
  const [filters, setFilters] = useState({ topic: "", difficulty: "", count: 5 });
  const [session, setSession] = useState(null);

  const filtered = useMemo(() => {
    let list = [...bank];
    if (filters.topic) list = list.filter((q) => q.topic === filters.topic);
    if (filters.difficulty) list = list.filter((q) => q.difficulty === filters.difficulty);
    return list;
  }, [bank, filters]);

  const startSession = () => {
    let list = [...filtered];
    if (settings.shuffle) list = shuffleArray(list);
    const pick = list.slice(0, Math.max(1, Math.min(filters.count, list.length)));
    setSession({
      questions: pick,
      index: 0,
      answers: {},
      submitted: false,
      score: 0,
      startedAt: Date.now(),
    });
  };

  if (!bank.length)
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-gray-600">Your question bank is empty. Switch to <b>Build Bank</b> to add some questions.</p>
        </CardContent>
      </Card>
    );

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter size={18}/> Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <Label>Topic</Label>
              <Select value={filters.topic} onValueChange={(v) => setFilters((s) => ({ ...s, topic: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  {Array.from(new Set(bank.map((q) => q.topic))).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={filters.difficulty} onValueChange={(v) => setFilters((s) => ({ ...s, difficulty: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Question Count</Label>
              <Input type="number" min={1} max={50} value={filters.count} onChange={(e) => setFilters((s) => ({ ...s, count: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2"><Shuffle size={16}/> {settings.shuffle ? "Shuffled" : "Ordered"}</span>
              <span className="flex items-center gap-2"><Square size={16}/> {settings.examMode ? "Exam Mode" : "Practice Mode"}</span>
              <span className="flex items-center gap-2">💡 {settings.showExplanations ? "Show explanations" : "Hide explanations"}</span>
            </div>
            <Button className="gap-2" onClick={startSession}><Play size={16}/> Start</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <QuizRunner session={session} setSession={setSession} showExplanations={settings.showExplanations} examMode={settings.examMode} />
  );
}

function QuizRunner({ session, setSession, showExplanations, examMode }) {
  const q = session.questions[session.index];
  const progress = Math.round(((session.index) / session.questions.length) * 100);

  const selectAnswer = (value) => {
    setSession((s) => ({ ...s, answers: { ...s.answers, [q.id]: value } }));
  };

  const isCorrect = (qid) => {
    const qq = session.questions.find((x) => x.id === qid);
    return String(session.answers[qid] || "").trim().toLowerCase() === String(qq.answer).trim().toLowerCase();
  };

  const next = () => {
    if (session.index < session.questions.length - 1) setSession((s) => ({ ...s, index: s.index + 1 }));
  };
  const prev = () => {
    if (session.index > 0) setSession((s) => ({ ...s, index: s.index - 1 }));
  };

  const submit = () => {
    const correct = session.questions.reduce((acc, item) => acc + (isCorrect(item.id) ? 1 : 0), 0);
    setSession((s) => ({ ...s, submitted: true, score: correct }));
  };

  const reset = () => setSession(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question {session.index + 1} / {session.questions.length}</span>
          <div className="flex items-center gap-3 w-1/2">
            <Progress value={progress} />
            <Badge>{progress}%</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-gray-50 p-4 text-base">{q.question}</div>

        {q.type === "mcq" ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {q.options.map((opt, i) => {
              const chosen = session.answers[q.id] === opt;
              const correct = session.submitted && opt === q.answer;
              const wrong = session.submitted && chosen && !correct;
              return (
                <button
                  key={i}
                  onClick={() => !session.submitted && selectAnswer(opt)}
                  className={cx(
                    "rounded-2xl border p-3 text-left transition",
                    chosen && !session.submitted && "ring-2 ring-black",
                    correct && "border-green-600 bg-green-50",
                    wrong && "border-red-600 bg-red-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {session.submitted ? correct ? <Check size={16}/> : wrong ? <X size={16}/> : <span className="w-4"/> : <span className="w-4"/>}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Your Answer</Label>
            <Input
              value={session.answers[q.id] || ""}
              onChange={(e) => !session.submitted && selectAnswer(e.target.value)}
              placeholder="Type your answer"
            />
            {session.submitted && (
              <div className={cx("rounded-xl p-3 text-sm", isCorrect(q.id) ? "bg-green-50 border border-green-600" : "bg-red-50 border border-red-600")}
              >
                {isCorrect(q.id) ? "Correct" : (
                  <div>
                    <div className="font-medium">Correct answer:</div>
                    <div>{q.answer}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {session.submitted && showExplanations && q.explanation && (
          <div className="rounded-2xl border bg-white p-3 text-sm">
            <div className="mb-1 font-medium">Why:</div>
            <p className="text-gray-700">{q.explanation}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="capitalize">{q.topic}</Badge>
            <Badge className="capitalize">{q.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prev} disabled={session.index === 0}>Prev</Button>
            {session.index < session.questions.length - 1 && (
              <Button variant="outline" onClick={next}>Next</Button>
            )}
            {!session.submitted ? (
              <Button className="gap-2" onClick={submit}><Square size={16}/> Submit</Button>
            ) : (
              <Button variant="outline" onClick={reset}>New Session</Button>
            )}
          </div>
        </div>

        {session.submitted && (
          <ResultStrip score={session.score} total={session.questions.length} />
        )}
      </CardContent>
    </Card>
  );
}

function ResultStrip({ score, total }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">Result</div>
        <Badge>{score} / {total} ({pct}%)</Badge>
      </div>
      <div className="mt-2"><Progress value={pct} /></div>
    </div>
  );
}

// ---------------------- Builder Panel ----------------------
function BuilderPanel({ bank, setBank }) {
  const blank = { id: uuidv4(), type: "mcq", question: "", options: ["", "", "", ""], answer: "", explanation: "", topic: "General", difficulty: "easy" };
  const [form, setForm] = useState(blank);

  const resetForm = () => setForm({ ...blank, id: uuidv4() });

  const addOption = () => setForm((f) => ({ ...f, options: [...(f.options || []), ""] }));
  const removeOption = (i) => setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  const setOption = (i, val) => setForm((f) => ({ ...f, options: f.options.map((o, idx) => (idx === i ? val : o)) }));

  const addQuestion = () => {
    if (!form.question.trim()) return alert("Question text required");
    if (form.type === "mcq") {
      const filled = (form.options || []).filter((o) => o.trim());
      if (filled.length < 2) return alert("MCQ needs at least 2 options");
      if (!filled.includes(form.answer)) return alert("Answer must match one of the options");
    } else if (!form.answer.trim()) return alert("Answer required for short question");

    setBank((prev) => [{ ...form, id: uuidv4() }, ...prev]);
    resetForm();
  };

  const deleteQuestion = (id) => setBank((prev) => prev.filter((q) => q.id !== id));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus size={18}/> Add Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}>
                <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Topic</Label>
            <Input value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))} placeholder="e.g., DSA, DBMS, Web" />
          </div>

          <div>
            <Label>Question</Label>
            <Textarea rows={3} value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="Write the question here" />
          </div>

          {form.type === "mcq" ? (
            <div className="space-y-2">
              <Label>Options</Label>
              {(form.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                  <Button variant="outline" onClick={() => removeOption(i)}><Trash2 size={16}/></Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={addOption}><Plus size={16}/> Add Option</Button>
              </div>
              <div>
                <Label>Correct Answer (must match an option)</Label>
                <Input value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="Paste exact option text" />
              </div>
            </div>
          ) : (
            <div>
              <Label>Correct Answer</Label>
              <Input value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="Short text" />
            </div>
          )}

          <div>
            <Label>Explanation (optional)</Label>
            <Textarea rows={2} value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} placeholder="Why this is the answer" />
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={addQuestion}><Plus size={16}/> Add to Bank</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question Bank ({bank.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-2">
            {bank.map((q) => (
              <div key={q.id} className="rounded-2xl border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge className="capitalize">{q.topic}</Badge>
                    <Badge className="capitalize">{q.difficulty}</Badge>
                    <Badge className="capitalize">{q.type}</Badge>
                  </div>
                  <Button variant="outline" onClick={() => deleteQuestion(q.id)} className="gap-2"><Trash2 size={16}/> Delete</Button>
                </div>
                <div className="text-sm">{q.question}</div>
                {q.type === "mcq" && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                    {q.options.map((o, i) => (
                      <li key={i} className={cx(o === q.answer && "font-medium text-black")}>
                        {o} {o === q.answer && <Badge className="ml-2">Answer</Badge>}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === "short" && (
                  <div className="mt-1 text-sm text-gray-700">Answer: <span className="font-medium">{q.answer}</span></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------- Import / Export ----------------------
function ImportExportPanel({ bank, setBank }) {
  const fileRef = useRef(null);

  const download = () => {
    const blob = new Blob([JSON.stringify(bank, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `question-bank-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("JSON must be an array of questions");
        const sanitized = data.map((q) => ({
          id: q.id || uuidv4(),
          type: q.type === "short" ? "short" : "mcq",
          question: String(q.question || "").trim(),
          options: q.type === "mcq" ? (Array.isArray(q.options) ? q.options.map(String) : []) : undefined,
          answer: String(q.answer || ""),
          explanation: String(q.explanation || ""),
          topic: String(q.topic || "General"),
          difficulty: DIFFICULTIES.includes(q.difficulty) ? q.difficulty : "easy",
        }));
        setBank((prev) => [...sanitized, ...prev]);
        alert(`Imported ${sanitized.length} questions ✅`);
      } catch (err) {
        alert("Invalid JSON: " + err.message);
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const sample = {
    id: "any-unique-id",
    type: "mcq",
    question: "Which data structure uses FIFO order?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    explanation: "First In, First Out.",
    topic: "DSA",
    difficulty: "easy",
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download size={18}/> Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Download your current question bank as JSON.</p>
          <Button className="gap-2" onClick={download}><Download size={16}/> Download JSON</Button>
          <Separator />
          <div>
            <div className="mb-1 text-sm font-medium">Shape</div>
            <pre className="max-h-64 overflow-auto rounded-2xl bg-gray-50 p-3 text-xs">{JSON.stringify(sample, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Upload size={18}/> Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Upload a JSON file with an array of questions. We'll merge with your existing bank.</p>
          <input ref={fileRef} type="file" accept="application/json" onChange={onUpload} />
          <div className="rounded-2xl border bg-white p-3 text-xs text-gray-600">
            Tip: Keep a backup before importing large files, just in case ✨
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------- Settings ----------------------
function SettingsPanel({ settings, setSettings, setBank }) {
  const toggle = (k) => setSettings((s) => ({ ...s, [k]: !s[k] }));

  const hardReset = () => {
    if (!confirm("Reset question bank to defaults?")) return;
    setBank(DEFAULT_BANK);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div>
            <div className="font-medium">Exam Mode</div>
            <div className="text-sm text-gray-600">Hide correctness until you submit. Score at the end.</div>
          </div>
          <Switch checked={settings.examMode} onCheckedChange={() => toggle("examMode")} />
        </div>
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div>
            <div className="font-medium">Shuffle Questions</div>
            <div className="text-sm text-gray-600">Randomize order when starting a session.</div>
          </div>
          <Switch checked={settings.shuffle} onCheckedChange={() => toggle("shuffle")} />
        </div>
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div>
            <div className="font-medium">Show Explanations</div>
            <div className="text-sm text-gray-600">Display the reasoning after answering.</div>
          </div>
          <Switch checked={settings.showExplanations} onCheckedChange={() => toggle("showExplanations")} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Reset Bank</div>
            <div className="text-sm text-gray-600">Restore the starter questions.</div>
          </div>
          <Button variant="outline" onClick={hardReset}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------- Optional: Hook up OpenAI later ----------------------
// You can replace or enrich DEFAULT_BANK using an API call elsewhere in your app.
// Example shape you'd want to produce (pseudo-code):
// async function generateQuestionsWithOpenAI(topic, count) {
//   const prompt = `Generate ${count} MCQ and short-answer questions about ${topic} as JSON`;
//   const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt }) });
//   const items = await res.json(); // ensure it matches the bank shape
//   return items.map((q) => ({ ...q, id: uuidv4() }));
// }
