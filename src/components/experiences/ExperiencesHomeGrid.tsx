'use client';

import React from 'react';
import { SacredExperience } from '@/types';
import { ExperienceCard } from './ExperienceCard';
import { useCMS } from '@/contexts/CMSContext';

interface ExperiencesHomeGridProps {
  initialExperiences: SacredExperience[];
}

export function ExperiencesHomeGrid({ initialExperiences }: ExperiencesHomeGridProps) {
  const { experiences } = useCMS();
  const list = experiences && experiences.length > 0 ? experiences : initialExperiences;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {list.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
}
