'use client';

import { createContext, useContext } from 'react';

import type { ProgramDayBlock, ProgramDayExercise } from '@/src/entities/program/model/structure';

// Lets a group's exercise list render the live drag order (gap animation) without
// threading lane state through the intermediate block/card components.
const RenderedExercisesContext = createContext<((block: ProgramDayBlock) => ProgramDayExercise[]) | null>(null);
export const RenderedExercisesProvider = RenderedExercisesContext.Provider;

export const useRenderedExercises = (block: ProgramDayBlock): ProgramDayExercise[] => {
  const resolve = useContext(RenderedExercisesContext);
  return resolve ? resolve(block) : block.exercises;
};

// A single block dragged over a group shows a non-droppable ghost row at the end
// of that group (the drop appends). Keeping it out of the droppable graph avoids
// an onDragOver feedback loop that a real preview row would cause.
export type SingleImportPreview = { blockId: string; exercise: ProgramDayExercise };
const SingleImportContext = createContext<SingleImportPreview | null>(null);
export const SingleImportProvider = SingleImportContext.Provider;

export const useSingleImportGhost = (block: ProgramDayBlock): ProgramDayExercise | null => {
  const preview = useContext(SingleImportContext);
  return preview && preview.blockId === block.id ? preview.exercise : null;
};
