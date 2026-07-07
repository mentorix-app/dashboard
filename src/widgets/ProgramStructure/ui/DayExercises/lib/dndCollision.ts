import { closestCorners, pointerWithin, type CollisionDetection } from '@dnd-kit/core';

import { ProgramBlockType, type ProgramDayBlock } from '@/src/entities/program/model/structure';

import { BLOCK_DND_PREFIX, CONTAINER_DND_PREFIX, EXERCISE_DND_PREFIX, findBlock } from './dndLanes';

/**
 * Blocks may target other blocks; a single may additionally hand its exercise to
 * a group, but only when the pointer is actually inside that group's exercise
 * list — otherwise the single reorders among blocks (so it can pass above a
 * group). A grouped exercise targets a group while the pointer is inside one, and
 * otherwise falls back to the block plane so it can be extracted into a new single.
 */
export const buildCollisionDetection =
  (blocks: ProgramDayBlock[]): CollisionDetection =>
  (args) => {
    const activeId = String(args.active.id);
    if (activeId.startsWith(BLOCK_DND_PREFIX)) {
      const active = findBlock(blocks, activeId.slice(2));
      const single = active?.blockType === ProgramBlockType.Single;
      const blockContainers = args.droppableContainers.filter((container) =>
        String(container.id).startsWith(BLOCK_DND_PREFIX)
      );
      if (!single) return closestCorners({ ...args, droppableContainers: blockContainers });

      const innerContainers = args.droppableContainers.filter((container) => {
        const id = String(container.id);
        return id.startsWith(CONTAINER_DND_PREFIX) || id.startsWith(EXERCISE_DND_PREFIX);
      });
      const inner = pointerWithin({ ...args, droppableContainers: innerContainers });
      if (inner.length > 0) return inner;
      return closestCorners({ ...args, droppableContainers: blockContainers });
    }

    const innerContainers = args.droppableContainers.filter((container) => {
      const id = String(container.id);
      return id.startsWith(CONTAINER_DND_PREFIX) || id.startsWith(EXERCISE_DND_PREFIX);
    });
    const inner = pointerWithin({ ...args, droppableContainers: innerContainers });
    if (inner.length > 0) return inner;

    const blockContainers = args.droppableContainers.filter((container) =>
      String(container.id).startsWith(BLOCK_DND_PREFIX)
    );
    return closestCorners({ ...args, droppableContainers: blockContainers });
  };
