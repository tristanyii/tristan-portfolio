"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, Plus, Trash2, Target, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Goal {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  note?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface GoalsChecklistProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Technical", "Career", "Learning", "Health", "Personal", "Impact", "General"];

function useCountdown() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  const diff = endOfYear.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function GoalsChecklist({ isOpen, onClose }: GoalsChecklistProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shiftCount, setShiftCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [titleText, setTitleText] = useState("");
  const [saving, setSaving] = useState(false);
  const countdown = useCountdown();

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchGoals();
  }, [isOpen, fetchGoals]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const unlocked = document.cookie.split(";").some((c) => c.trim().startsWith("analytics_unlocked=true"));
    if (unlocked) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingNote !== null) {
          setEditingNote(null);
        } else if (showAddForm) {
          setShowAddForm(false);
        } else {
          onClose();
        }
      }
      if (e.key === "Shift") {
        setShiftCount((prev) => {
          const next = prev + 1;
          if (next >= 10 && !isAdmin) {
            document.cookie = "analytics_unlocked=true;path=/;max-age=86400";
            setIsAdmin(true);
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isAdmin, editingNote, showAddForm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleGoal = async (goal: Goal) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goal.id, completed: !goal.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      }
    } catch (err) {
      console.error("Failed to toggle goal:", err);
    } finally {
      setSaving(false);
    }
  };

  const addGoal = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), category: newCategory }),
      });
      if (res.ok) {
        const goal = await res.json();
        setGoals((prev) => [...prev, goal]);
        setNewTitle("");
        setNewCategory("General");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async (goalId: number) => {
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goalId, note: noteText }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setEditingNote(null);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveTitle = async (goalId: number) => {
    const trimmed = titleText.trim();
    if (!trimmed) { setEditingTitle(null); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goalId, title: trimmed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      }
    } catch (err) {
      console.error("Failed to save title:", err);
    } finally {
      setSaving(false);
      setEditingTitle(null);
    }
  };

  const deleteGoal = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete goal:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const grouped = goals.reduce<Record<string, Goal[]>>((acc, g) => {
    const cat = g.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(g);
    return acc;
  }, {});

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">2026 Goals</h2>
          {isAdmin && (
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              Admin
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Countdown + Progress */}
      <div className="px-6 py-5 border-b border-border shrink-0 bg-muted/20">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          {/* Countdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {[
              { value: countdown.days, label: "days" },
              { value: countdown.hours, label: "hrs" },
              { value: countdown.minutes, label: "min" },
              { value: countdown.seconds, label: "sec" },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-foreground">
                  {pad(unit.value)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {unit.label}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground ml-1 hidden sm:block">left in 2026</p>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border" />

          {/* Progress */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">
                {completedCount}/{totalCount} complete
              </span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && isAdmin && (
        <div className="px-6 py-4 border-b border-border shrink-0 bg-primary/5">
          <div className="max-w-3xl mx-auto space-y-3">
            <input
              type="text"
              placeholder="What's the goal?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={addGoal} disabled={!newTitle.trim() || saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Goals list */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No goals yet.</p>
              {isAdmin && <p className="text-sm mt-1">Click &quot;Add Goal&quot; to get started.</p>}
            </div>
          ) : (
            Object.entries(grouped).map(([category, categoryGoals]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {categoryGoals.filter((g) => g.completed).length}/{categoryGoals.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {categoryGoals.map((goal) => (
                    <div key={goal.id} className="group">
                      <div
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isAdmin ? "hover:bg-muted/50" : ""
                        } ${goal.completed ? "opacity-60" : ""}`}
                      >
                        <button
                          onClick={() => toggleGoal(goal)}
                          disabled={!isAdmin || saving}
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                            goal.completed
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/30 hover:border-primary/50"
                          } ${!isAdmin ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {goal.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          {editingTitle === goal.id && isAdmin ? (
                            <input
                              value={titleText}
                              onChange={(e) => setTitleText(e.target.value)}
                              onBlur={() => saveTitle(goal.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveTitle(goal.id);
                                if (e.key === "Escape") setEditingTitle(null);
                              }}
                              autoFocus
                              className="text-base font-medium w-full bg-transparent outline-none border-b-2 border-primary/40 focus:border-primary px-0 py-0.5"
                              style={{ font: "inherit", color: "inherit" }}
                            />
                          ) : (
                            <span
                              className={`text-base font-medium transition-all ${
                                goal.completed
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              } ${isAdmin ? "cursor-pointer hover:text-primary" : ""}`}
                              onClick={() => {
                                if (isAdmin) {
                                  setEditingTitle(goal.id);
                                  setTitleText(goal.title);
                                }
                              }}
                            >
                              {goal.title}
                            </span>
                          )}

                          {/* Sticky note - always visible */}
                          {goal.note && editingNote !== goal.id && (
                            <div className="mt-2 relative">
                              <div className="bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300/40 dark:border-yellow-700/40 rounded px-3 py-2 shadow-sm rotate-[-0.5deg]">
                                <p className="text-sm text-yellow-900 dark:text-yellow-100/80 leading-relaxed whitespace-pre-wrap">
                                  {goal.note}
                                </p>
                              </div>
                            </div>
                          )}

                          {editingNote === goal.id && isAdmin && (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Leave a note..."
                                className="w-full px-3 py-2 rounded border border-yellow-300/60 bg-yellow-50 dark:bg-yellow-900/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-yellow-400/50 resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => setEditingNote(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => saveNote(goal.id)}
                                  disabled={saving}
                                >
                                  {saving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {isAdmin && editingNote !== goal.id && (
                          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingNote(goal.id);
                                setNoteText(goal.note || "");
                              }}
                              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="Add/edit note"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              title="Delete goal"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
