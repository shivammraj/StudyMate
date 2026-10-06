import React, { useState } from 'react';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import {
  User,
  Award,
  Flame,
  BookOpen,
  RotateCcw,
  Edit3,
  Check,
  X,
  GraduationCap,
  Building,
  Hash,
  Target,
  Code2,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate / M.Tech'];

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
];

const GOALS = [
  'DSA Mastery & Top Placement',
  'Competitive Programming (Codeforces / LeetCode)',
  'GATE 2026 Examination',
  'Core Engineering Concepts & Semester Exams',
  'Open Source & System Software Development',
];

const LANGUAGES = ['C++', 'Java', 'Python', 'TypeScript', 'Rust', 'Go'];

export const Profile: React.FC = () => {
  const { student, updateStudent, resetToDemo } = useStudyMate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
    year: student.year,
    branch: student.branch,
    college: student.college,
    rollNo: student.rollNo,
    goal: student.goal,
    preferredLanguage: student.preferredLanguage,
    bio: student.bio,
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(formData);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: student.name,
      year: student.year,
      branch: student.branch,
      college: student.college,
      rollNo: student.rollNo,
      goal: student.goal,
      preferredLanguage: student.preferredLanguage,
      bio: student.bio,
    });
    setIsEditing(false);
  };

  // Derive initials
  const initials = student.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SM';

  return (
    <div className="max-w-[860px] mx-auto flex flex-col gap-8 py-4 px-4">
      <PageHeader
        title="Student Profile"
        lead="Manage learning goals, curriculum focus, and platform credentials for your StudyMate workspace."
      />

      {showSavedToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[10px] text-[14px] font-sans font-medium flex items-center justify-between shadow-xs animate-view-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile updated successfully! Changes are active across StudyMate.
          </span>
          <button
            type="button"
            onClick={() => setShowSavedToast(false)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Profile Showcase Card */}
      <div className="glass-card p-6 sm:p-8 rounded-[16px] border border-slate-200/90 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[var(--navy)] via-[var(--blue)] to-indigo-500 text-white text-[26px] font-bold font-serif flex items-center justify-center shadow-md shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-[24px] text-[var(--ink)]">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-[var(--pale)] text-[var(--navy)] border border-[var(--blue)]/20">
                  {student.year}
                </span>
              </div>
              <p className="text-[14px] text-[var(--muted)] font-sans mt-0.5">
                {student.branch} • {student.college}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[12px] font-mono text-[var(--muted)]">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  Target: {student.goal}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  Lang: {student.preferredLanguage}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            size="md"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 self-start sm:self-center"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        </div>

        {/* Edit Form or View State */}
        {isEditing ? (
          <form onSubmit={handleSave} className="pt-6 flex flex-col gap-6 animate-view-in">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-[var(--blue)] flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile Details
              </span>
              <span className="text-[11px] font-sans text-[var(--muted)]">
                All changes persist automatically to your session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              {/* Academic Year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Academic Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)] cursor-pointer"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department / Branch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Engineering Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)] cursor-pointer"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* College / University */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  College / University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Delhi Technological University"
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              {/* Roll / Student ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Student ID / Roll No.
                </label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="e.g. 2026-CSE-042"
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              {/* Primary Target Goal */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  Learning Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)] cursor-pointer"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Language */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  Preferred Language
                </label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)] cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio / Focus */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[12px] font-sans font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  Bio & Focus Areas
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your current focus areas (e.g. Algorithms, Dynamic Programming, Operating Systems)..."
                  className="p-3 bg-white border border-slate-200 rounded-[8px] text-[14px] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--blue)] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button type="button" variant="secondary" size="md" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" className="inline-flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-6 flex flex-col gap-6">
            {/* Bio callout */}
            <div className="p-4 bg-slate-50/80 rounded-[10px] border border-slate-200/80 text-[14px] text-[var(--ink)] leading-relaxed italic">
              "{student.bio}"
            </div>

            {/* Academic Credentials Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-white rounded-[10px] border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Roll / ID</span>
                <div className="text-[14px] font-sans font-bold text-[var(--ink)] mt-0.5">
                  {student.rollNo}
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-[10px] border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Language</span>
                <div className="text-[14px] font-sans font-bold text-[var(--blue)] mt-0.5">
                  {student.preferredLanguage}
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-[10px] border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Status</span>
                <div className="text-[14px] font-sans font-bold text-[var(--green)] mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Student
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-[10px] border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Target</span>
                <div className="text-[13px] font-sans font-bold text-[var(--navy)] mt-0.5 truncate">
                  {student.goal}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4.5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <span className="text-[11px] uppercase font-bold text-[var(--muted)] font-mono">
            Daily Streak
          </span>
          <div className="text-[22px] font-bold text-amber-600 flex items-center gap-1.5 font-serif">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            <span>{student.streak} Days</span>
          </div>
          <span className="text-[11px] font-sans text-slate-500">Consistent daily learner</span>
        </div>

        <div className="p-4.5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <span className="text-[11px] uppercase font-bold text-[var(--muted)] font-mono">
            Platform XP
          </span>
          <div className="text-[22px] font-bold text-[var(--blue)] font-serif">
            {student.xp} XP
          </div>
          <span className="text-[11px] font-sans text-slate-500">Tier: Advanced Apprentice</span>
        </div>

        <div className="p-4.5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <span className="text-[11px] uppercase font-bold text-[var(--muted)] font-mono">
            Solved Questions
          </span>
          <div className="text-[22px] font-bold text-[var(--green)] font-serif">
            {student.questionsSolved}
          </div>
          <span className="text-[11px] font-sans text-slate-500">Across DSA & Math</span>
        </div>

        <div className="p-4.5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <span className="text-[11px] uppercase font-bold text-[var(--muted)] font-mono">
            Study Accuracy
          </span>
          <div className="text-[22px] font-bold text-indigo-700 font-serif">
            {student.accuracy}%
          </div>
          <span className="text-[11px] font-sans text-slate-500">Diagnostic verified</span>
        </div>
      </div>

      {/* Reset State Option */}
      <div className="p-4.5 bg-slate-50/70 border border-slate-200/80 rounded-[12px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span className="text-[13px] text-[var(--muted)] font-sans">
            Need to reset your demo sessions and test initial starter data?
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={resetToDemo}
          className="inline-flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          <span>Reset Demo State</span>
        </Button>
      </div>
    </div>
  );
};
