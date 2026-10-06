import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.js';
import { JourneyBar, JourneyStep } from '../components/ui/JourneyBar.js';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { Sparkles, User, Bell } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const { student, activeMission } = useStudyMate();

  // Determine current journey step if in a learning cycle
  let currentStep: JourneyStep | null = null;
  if (path === '/ask') currentStep = 'ask';
  else if (path.startsWith('/learn')) currentStep = 'learn';
  else if (path.startsWith('/practice') || path.startsWith('/quiz') && !path.includes('results')) currentStep = 'practice';
  else if (path.includes('results')) currentStep = 'results';
  else if (path.startsWith('/revision')) currentStep = 'revision';

  return (
    <div className="min-h-screen flex bg-paper ambient-mesh text-ink font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[60px] bg-white/80 backdrop-blur-md border-b border-[var(--color-line)] px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-sans text-[var(--color-ink-2)]">
              Student Workspace
            </span>
            <span className="text-[var(--color-line)]">/</span>
            <span className="font-serif font-bold text-[16px] text-[var(--color-ink)]">
              {student.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/ask"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EEFD] hover:bg-[#DCE6FC] text-[var(--color-pen)] rounded-[6px] text-[13px] font-sans font-semibold border border-[var(--color-pen)]/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask StudyMate</span>
            </Link>

            {activeMission && !activeMission.completed && (
              <Link
                to="/revision"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-developing-tint)] text-[var(--color-developing)] rounded-[6px] text-[13px] font-sans font-semibold border border-[var(--color-developing)]/30 hover:opacity-90 transition-opacity"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Mission Active</span>
              </Link>
            )}

            <div className="w-[1px] h-6 bg-[var(--color-line)]"></div>

            <Link
              to="/profile"
              className="flex items-center gap-2 text-[14px] font-sans font-medium text-[var(--color-ink)] hover:text-[var(--color-pen)] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--color-pen)] text-white font-bold text-[13px] flex items-center justify-center">
                SM
              </div>
              <span className="hidden sm:inline font-semibold">{student.name}</span>
            </Link>
          </div>
        </header>

        {/* Journey Bar (Only shown on loop routes) */}
        {currentStep && <JourneyBar current={currentStep} />}

        {/* Dynamic Page Workspace */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1280px] w-full mx-auto pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};
