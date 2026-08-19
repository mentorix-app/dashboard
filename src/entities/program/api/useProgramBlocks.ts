'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import { writeProgramDetail } from '../lib';
import type {
  DeleteProgramDayBlockResponse,
  DeleteProgramDayBlockVariables,
  MergeProgramDayBlocksResponse,
  MergeProgramDayBlocksVariables,
  PatchProgramDayBlockResponse,
  PatchProgramDayBlockVariables,
  SetProgramDayBlockClientsResponse,
  SetProgramDayBlockClientsVariables,
  UngroupProgramDayBlockResponse,
  UngroupProgramDayBlockVariables,
} from '../model/programBlocks';
import { blockPath, dayBlocksPath } from './programBlockPaths';

export const useMergeProgramDayBlocks = () => {
  const queryClient = useQueryClient();

  // POST .../days/{dayId}/blocks/merge groups 2+ blocks; new group defaults to `complex`.
  return useMutation<MergeProgramDayBlocksResponse, HttpError, MergeProgramDayBlocksVariables>({
    mutationFn: ({ programId, weekId, dayId, blockIds }) =>
      http
        .post<MergeProgramDayBlocksResponse>(`${dayBlocksPath(programId, weekId, dayId)}/merge`, { blockIds })
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const usePatchProgramDayBlock = () => {
  const queryClient = useQueryClient();

  // PATCH .../blocks/{blockId} changes a group block's type and/or instruction.
  return useMutation<PatchProgramDayBlockResponse, HttpError, PatchProgramDayBlockVariables>({
    mutationFn: ({ programId, weekId, blockId, ...body }) =>
      http
        .patch<PatchProgramDayBlockResponse>(blockPath(programId, weekId, blockId), body)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useSetProgramDayBlockClients = () => {
  const queryClient = useQueryClient();

  return useMutation<SetProgramDayBlockClientsResponse, HttpError, SetProgramDayBlockClientsVariables>({
    mutationFn: ({ programId, weekId, blockId, clientUserIds }) =>
      http
        .put<SetProgramDayBlockClientsResponse>(`${blockPath(programId, weekId, blockId)}/clients`, {
          clientUserIds,
        })
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useUngroupProgramDayBlock = () => {
  const queryClient = useQueryClient();

  // POST .../blocks/{blockId}/ungroup splits a group back into `single` blocks.
  return useMutation<UngroupProgramDayBlockResponse, HttpError, UngroupProgramDayBlockVariables>({
    mutationFn: ({ programId, weekId, blockId }) =>
      http
        .post<UngroupProgramDayBlockResponse>(`${blockPath(programId, weekId, blockId)}/ungroup`)
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};

export const useDeleteProgramDayBlock = () => {
  const queryClient = useQueryClient();

  // DELETE .../blocks/{blockId} removes a group block (single blocks are removed
  // via their last exercise instead).
  return useMutation<DeleteProgramDayBlockResponse, HttpError, DeleteProgramDayBlockVariables>({
    mutationFn: ({ programId, weekId, blockId }) =>
      http
        .delete<DeleteProgramDayBlockResponse>(blockPath(programId, weekId, blockId))
        .then((response) => response.data),
    onSuccess: (program) => writeProgramDetail(queryClient, program),
  });
};
