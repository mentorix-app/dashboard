import { generateOAuthValue, hashNonce } from '../nonce.utils';

describe('hashNonce', () => {
  it('returns the lowercase hex SHA-256 of the raw value', () => {
    // Known SHA-256 test vector for "abc".
    expect(hashNonce('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('generateOAuthValue', () => {
  it('is URL-safe and far below the 256 characters the API accepts', () => {
    const value = generateOAuthValue();

    expect(value).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('differs on every call', () => {
    expect(generateOAuthValue()).not.toBe(generateOAuthValue());
  });
});
