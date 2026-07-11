import type { Client } from '../model/types';

/**
 * A client is assignable by the current user only when they own the trainer
 * link. Trainers only ever receive their own clients, but admins see every
 * trainer's clients and may assign programs solely to their own.
 */
export const isClientOwnedBy = (client: Pick<Client, 'trainerUserId'>, userId: string | undefined): boolean =>
  Boolean(userId) && client.trainerUserId === userId;
