import { AUTH_ERROR_CODES, DELETE_ACCOUNT_ERROR_CODES } from './auth.constants';
import type { AuthErrorCode, DeleteAccountErrorCode } from './auth.types';

export const isAuthErrorCode = (value: unknown): value is AuthErrorCode =>
  typeof value === 'string' && AUTH_ERROR_CODES.some((code) => code === value);

export const isDeleteAccountErrorCode = (value: unknown): value is DeleteAccountErrorCode =>
  typeof value === 'string' && DELETE_ACCOUNT_ERROR_CODES.some((code) => code === value);
