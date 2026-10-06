import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bar } from '../components/ui/Bar.js';
import {
  Network,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';

interface MapNode {
  id: string;
  name: string;
  category: 'core' | 'linear' | 'hierarchical' | 'graph';
  x: number; // percentage
  y: number; // percentage
  connections: string[];
}

const MAP_NODES: MapNode[] = [
  { id: 'arrays', name: 'Arrays', category: 'core', x: 20, y: 30, connections: ['searching', 'sorting'] },
  { id: 'searching', name: 'Binary Search', category: 'core', x: 42, y: 22, connections: ['recursion'] },
  { id: 'sorting', name: 'Sorting', category: 'core', x: 40, y: 50, connections: ['recursion'] },
  { id: 'linked-lists', name: 'Linked Lists', category: 'linear', x: 22, y: 72, connections: ['stack', 'queue'] },
  { id: 'stack', name: 'Stack', category: 'linear', x: 42, y: 72, connections: ['recursion'] },
  { id: 'queue', name: 'Queue', category: 'linear', x: 42, y: 88, connections: ['graphs'] },
  { id: 'recursion', name: 'Recursion', category: 'core', x: 65, y: 40, connections: ['trees'] },
  { id: 'trees', name: 'Trees', category: 'hierarchical', x: 80, y: 32, connections: ['graphs'] },
  { id: 'graphs', name: 'Graphs', category: 'graph', x: 85, y: 68, connections: [] },
];

export const KnowledgeMap: React.FC = () => {
  const navigate = useNavigate();
  const { masteryList, weaknesses } = useStudyMate();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('searching');

  const selectedNode = MAP_NODES.find((n) => n.id === selectedNodeId) || MAP_NODES[1];
  const nodeMastery = masteryList.find(
    (m) => m.topic.toLowerCase() === selectedNode.name.toLowerCase()
  ) || {
    topic: selectedNode.name,
    mastery: 50,
    questionsAttempted: 8,
    questionsCorrect: 4,
    conceptScore: 60,
    applicationScore: 50,
    edgeCaseScore: 40,
    lastPracticed: 'Recently',
  };

  const nodeWeakness = weaknesses.find(
    (w) => w.topic.toLowerCase() === selectedNode.name.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Engineering Knowledge Map"
        lead="Visual dependency graph of your Computer Science curriculum. Every node updates dynamically as your practice questions and quizzes evaluate mastery."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="graph-paper border border-[var(--color-line)] rounded-[8px] p-6 relative min-h-[460px] flex items-center justify-center overflow-hidden shadow-xs">
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {MAP_NODES.flatMap((node) =>
                node.connections.map((targetId) => {
                  const targetNode = MAP_NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke="#C5BFB0"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })
              )}
            </svg>

            {/* Interactive Nodes */}
            {MAP_NODES.map((node) => {
              const masteryObj = masteryList.find(
                (m) => m.topic.toLowerCase() === node.name.toLowerCase()
              );
              const score = masteryObj?.mastery ?? 50;

              const isSelected = node.id === selectedNodeId;

              // Color classification based on mastery score
              let badgeBg = 'bg-[#EDEAE1] text-[var(--color-ink)] border-[var(--color-line)]';
              if (score >= 80) {
                badgeBg = 'bg-[var(--color-strong-tint)] text-[var(--color-strong)] border-[var(--color-strong)]/40';
              } else if (score >= 55) {
                badgeBg = 'bg-[var(--color-developing-tint)] text-[var(--color-developing)] border-[var(--color-developing)]/40';
              } else {
                badgeBg = 'bg-[var(--color-weak-tint)] text-[var(--color-weak)] border-[var(--color-weak)]/40';
              }

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200 select-none ${
                    isSelected ? 'scale-115 ring-3 ring-[var(--color-pen)] rounded-[8px]' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-[8px] border font-sans font-bold text-[13px] shadow-sm flex flex-col items-center min-w-[100px] ${badgeBg}`}
                  >
                    <span>{node.name}</span>
                    <span className="text-[11px] font-mono font-normal opacity-85">
                      {score}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Legend at bottom left */}
            <div className="absolute bottom-3 left-4 bg-white/90 border border-[var(--color-line)] px-3 py-2 rounded-[6px] flex items-center gap-4 text-[11px] font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-strong)]"></span>
                Solid (&gt;80%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-developing)]"></span>
                Developing (55-79%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-weak)]"></span>
                Weak (&lt;55%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Drawer: Selected Node Details (Master Prompt Item #17) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Panel className="border-l-[4px] border-l-[var(--color-pen)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-pen)]">
                  Topic Node Details
                </span>
                <h3 className="font-serif font-bold text-[20px] text-[var(--color-ink)]">
                  {selectedNode.name}
                </h3>
              </div>
              <span className="font-mono font-bold text-[18px] text-[var(--color-pen)]">
                {nodeMastery.mastery}%
              </span>
            </div>

            <div className="flex flex-col gap-3 my-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[12px] font-sans text-[var(--color-ink-2)]">
                  <span>Current Mastery</span>
                  <span>{nodeMastery.mastery}%</span>
                </div>
                <Bar score={nodeMastery.mastery} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] font-sans">
                <div className="p-2 bg-white rounded border border-[var(--color-line)]">
                  <span className="text-[var(--color-ink-2)]">Questions:</span>
                  <div className="font-mono font-bold text-[14px]">
                    {nodeMastery.questionsAttempted}
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-[var(--color-line)]">
                  <span className="text-[var(--color-ink-2)]">Correct:</span>
                  <div className="font-mono font-bold text-[14px] text-[var(--color-strong)]">
                    {nodeMastery.questionsCorrect}
                  </div>
                </div>
              </div>

              {nodeWeakness ? (
                <div className="p-3 rounded bg-[var(--color-weak-tint)] border border-[var(--color-weak)]/30 text-[12px] font-sans">
                  <div className="flex items-center gap-1 font-bold text-[var(--color-weak)] mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Identified Weak Spot:</span>
                  </div>
                  <p className="text-[var(--color-ink)]">{nodeWeakness.area}</p>
                </div>
              ) : (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[12px] font-sans text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No severe weaknesses currently flagged.</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-line)]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/practice')}
                className="w-full inline-flex items-center justify-center gap-1.5"
              >
                <span>Practice {selectedNode.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/learn/${selectedNode.id}`)}
                className="w-full inline-flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Review Visual Lesson</span>
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
