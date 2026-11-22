'use client';

import React from 'react';
import { SacredExperience } from '@/types';
import { ExperienceCard } from './ExperienceCard';
import { useCMS } from '@/contexts/CMSContext';

interface ExperiencesHomeGridProps {
  initialExperiences: SacredExperience[];
}

export function ExperiencesHomeGrid({ initialExperiences }: ExperiencesHomeGridProps) {
  const { experiences, liveUpdated } = useCMS();
  // Server-rendered initialExperiences is the authoritative source of truth.
  // We only override it if an admin performed a real-time live CMS update in this active session.
  const hasLiveUpdate = liveUpdated?.experiences;
  const list = hasLiveUpdate && experiences && experiences.length > 0
    ? experiences
    : (initialExperiences && initialExperiences.length > 0 ? initialExperiences : experiences);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {list.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
}
