'use client';

import { queryKeys, useGet } from '@/src/shared/api';
import type { User } from '../model/types';

export const useGetMe = () => useGet<User>('/auth/me', queryKeys.user.me());
