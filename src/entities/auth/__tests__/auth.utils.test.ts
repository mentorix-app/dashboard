import { AUTH_ERROR_CODES, DELETE_ACCOUNT_ERROR_CODES } from '../auth.constants';
import { isAuthErrorCode, isDeleteAccountErrorCode } from '../auth.utils';

describe('isAuthErrorCode', () => {
  it.each(AUTH_ERROR_CODES)('accepts %s', (code) => {
    expect(isAuthErrorCode(code)).toBe(true);
  });

  it.each([undefined, null, 42, '', 'something_else'])('rejects %p', (value) => {
    expect(isAuthErrorCode(value)).toBe(false);
  });
});

describe('isDeleteAccountErrorCode', () => {
  it.each(DELETE_ACCOUNT_ERROR_CODES)('accepts %s', (code) => {
    expect(isDeleteAccountErrorCode(code)).toBe(true);
  });

  it.each([undefined, null, 42, '', 'something_else', 'rate_limited', ['has_data']])('rejects %p', (value) => {
    expect(isDeleteAccountErrorCode(value)).toBe(false);
  });
});
