'use client';

import { usePost } from '@/src/shared/api';

export type RegisterPayload = {
  email: string;
  password: string;
};

export const useRegister = () => usePost<unknown, Error, RegisterPayload>('/auth/register');
