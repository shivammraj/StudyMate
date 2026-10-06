import React from 'react';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { BandBadge } from '../components/ui/BandBadge.js';
import { Tag } from '../components/ui/Tag.js';
import { Bar } from '../components/ui/Bar.js';
import { Notice } from '../components/ui/Notice.js';

export const Styleguide: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="Design System & Academic Tokens"
        lead="Visual inventory of the StudyMate paper aesthetic, restrained blue accents, and typography tokens."
      />

      <Panel className="flex flex-col gap-4">
        <h3 className="font-serif font-bold text-[18px]">Buttons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="quiet">Quiet Action</Button>
          <Button variant="accent">Accent Action</Button>
          <Button variant="primary" isLoading>Loading</Button>
        </div>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <h3 className="font-serif font-bold text-[18px]">Mastery Badges & Bands</h3>
        <div className="flex flex-wrap items-center gap-3">
          <BandBadge band="strong" />
          <BandBadge band="developing" />
          <BandBadge band="weak" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag label="Computer Science" variant="default" />
          <Tag label="Interactive Simulation" variant="pen" />
          <Tag label="Verified Lesson" variant="highlight" />
        </div>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <h3 className="font-serif font-bold text-[18px]">Progress Bars</h3>
        <Bar score={82} label="Solid Mastery (>80%)" />
        <Bar score={61} label="Developing Mastery (50-79%)" />
        <Bar score={34} label="Needs Practice (<50%)" />
      </Panel>

      <Panel className="flex flex-col gap-4">
        <h3 className="font-serif font-bold text-[18px]">Notices & Alerts</h3>
        <Notice variant="info" title="Note" message="This is an informative academic callout." />
        <Notice variant="error" title="Warning" message="This indicates a diagnosed boundary misconception." />
      </Panel>
    </div>
  );
};
