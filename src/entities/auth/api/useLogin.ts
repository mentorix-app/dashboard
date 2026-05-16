'use client';

import { usePost } from '@/src/shared/api';

export type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => usePost<unknown, Error, LoginPayload>('/auth/login');
