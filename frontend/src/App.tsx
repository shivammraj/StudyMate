import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudyMateProvider } from './hooks/useStudyMate.js';
import { AppLayout } from './layouts/AppLayout.js';

// Pages
import { Dashboard } from './pages/Dashboard.js';
import { Ask } from './pages/Ask.js';
import { Learn } from './pages/Learn.js';
import { Practice } from './pages/Practice.js';
import { Results } from './pages/Results.js';
import { DsaLab } from './pages/DsaLab.js';
import { KnowledgeMap } from './pages/KnowledgeMap.js';
import { Weaknesses } from './pages/Weaknesses.js';
import { Revision } from './pages/Revision.js';
import { Resources } from './pages/Resources.js';
import { Materials } from './pages/Materials.js';
import { Progress } from './pages/Progress.js';
import { Profile } from './pages/Profile.js';
import { Settings } from './pages/Settings.js';
import { Styleguide } from './pages/Styleguide.js';

export const App: React.FC = () => {
  return (
    <StudyMateProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Root redirects to Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/onboarding" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Ask StudyMate */}
            <Route path="/ask" element={<Ask />} />

            {/* Learn & Visualize */}
            <Route path="/learn" element={<Navigate to="/learn/binary-search" replace />} />
            <Route path="/learn/:topic" element={<Learn />} />
            <Route path="/learn/:topic/visualize" element={<Learn />} />

            {/* Adaptive Practice */}
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/:id" element={<Practice />} />
            <Route path="/quiz/:id" element={<Practice />} />
            <Route path="/quiz/:id/results" element={<Results />} />
            <Route path="/results" element={<Results />} />

            {/* DSA Interactive Lab */}
            <Route path="/dsa" element={<DsaLab />} />
            <Route path="/dsa/:problemId" element={<DsaLab />} />
            <Route path="/dsa/:problemId/run" element={<DsaLab />} />

            {/* Intelligence Engine */}
            <Route path="/knowledge-map" element={<KnowledgeMap />} />
            <Route path="/weaknesses" element={<Weaknesses />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/materials" element={<Materials />} />

            {/* Analytics & Settings */}
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/styleguide" element={<Styleguide />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </StudyMateProvider>
  );
};
