import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code2,
  Network,
  AlertTriangle,
  Zap,
  BookmarkCheck,
  FileText,
  TrendingUp,
  User,
  Settings,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { useStudyMate } from '../../hooks/useStudyMate.js';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { student, activeMission, weaknesses, resetToDemo } = useStudyMate();

  const primaryNav: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/ask', label: 'Ask StudyMate', icon: Sparkles },
    { to: '/learn/binary-search', label: 'Learn & Visualize', icon: BookOpen },
    { to: '/practice', label: 'Adaptive Practice', icon: CheckCircle2 },
    { to: '/dsa', label: 'DSA Lab', icon: Code2 },
  ];

  const intelligenceNav: NavItem[] = [
    { to: '/knowledge-map', label: 'Knowledge Map', icon: Network },
    {
      to: '/weaknesses',
      label: 'Weakness Engine',
      icon: AlertTriangle,
      badge: weaknesses.length > 0 ? weaknesses.length : undefined,
    },
    {
      to: '/revision',
      label: 'Revision Missions',
      icon: Zap,
      badge: activeMission && !activeMission.completed ? '1 Active' : undefined,
    },
    { to: '/resources', label: 'Context Resources', icon: BookmarkCheck },
    { to: '/materials', label: 'Study Materials', icon: FileText },
  ];

  const accountNav: NavItem[] = [
    { to: '/progress', label: 'My Progress', icon: TrendingUp },
    { to: '/profile', label: 'Shivam Mavi', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-[var(--color-surface)] border-r border-[var(--color-line)] flex flex-col h-screen shrink-0 select-none sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--color-line)] flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[6px] bg-[var(--color-pen)] flex items-center justify-center text-white font-serif font-bold text-[18px] shadow-xs group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="font-serif font-bold text-[18px] text-[var(--color-ink)] leading-none tracking-tight">
              StudyMate
            </div>
            <div className="text-[11px] font-sans text-[var(--color-ink-2)] mt-0.5">
              Understand. Visualize. Master.
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-5">
        {/* Core Loop */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)]/80">
            Learning Loop
          </div>
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-[6px] text-[14px] font-sans font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E8EEFD] text-[var(--color-pen)] font-semibold border-l-3 border-[var(--color-pen)]'
                        : 'text-[var(--color-ink)] hover:bg-[#F2EFE8] hover:text-[var(--color-ink)]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[11px] font-sans font-semibold rounded bg-[var(--color-pen)] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Engine */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)]/80">
            Diagnostic Engine
          </div>
          <nav className="flex flex-col gap-1">
            {intelligenceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-[6px] text-[14px] font-sans font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E8EEFD] text-[var(--color-pen)] font-semibold border-l-3 border-[var(--color-pen)]'
                        : 'text-[var(--color-ink)] hover:bg-[#F2EFE8] hover:text-[var(--color-ink)]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[11px] font-sans font-semibold rounded bg-[var(--color-weak-tint)] text-[var(--color-weak)] border border-[var(--color-weak)]/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Account & Analytics */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)]/80">
            Student Analytics
          </div>
          <nav className="flex flex-col gap-1">
            {accountNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-[6px] text-[14px] font-sans font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E8EEFD] text-[var(--color-pen)] font-semibold border-l-3 border-[var(--color-pen)]'
                        : 'text-[var(--color-ink)] hover:bg-[#F2EFE8] hover:text-[var(--color-ink)]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Student Activity Footer */}
      <div className="p-4 border-t border-[var(--color-line)] bg-[#F8F6F0] flex flex-col gap-3">
        <div className="flex items-center justify-between text-[13px] font-sans">
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>{student.streak} Day Streak</span>
          </div>
          <div className="font-mono font-bold text-[var(--color-pen)] text-[12px]">
            {student.xp} XP
          </div>
        </div>

        <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-2)] pt-1">
          <span>Logged in: <strong>{student.name}</strong></span>
          <button
            type="button"
            onClick={resetToDemo}
            title="Reset demo data to initial Shivam Mavi state"
            className="flex items-center gap-1 text-[11px] text-[var(--color-ink-2)] hover:text-[var(--color-pen)] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
