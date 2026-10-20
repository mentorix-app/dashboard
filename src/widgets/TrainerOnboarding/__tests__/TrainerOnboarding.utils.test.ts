import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';

import { HttpError } from '@/src/shared/api';
import { getActivationErrorKey } from '../TrainerOnboarding.utils';

const buildError = (status?: number, data?: unknown): HttpError => {
  if (status === undefined) return new HttpError('Network Error', new AxiosError('Network Error'));

  const response: AxiosResponse = {
    status,
    statusText: '',
    data,
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
  return new HttpError(
    'request failed',
    new AxiosError('request failed', 'ERR_BAD_RESPONSE', undefined, undefined, response)
  );
};

describe('getActivationErrorKey', () => {
  it('recognises an administrator by the stable error code', () => {
    expect(getActivationErrorKey(buildError(403, { code: 'admin_cannot_activate' }))).toBe('admin');
  });

  it('reports a vanished account for the user_not_found code and for a bare 404', () => {
    expect(getActivationErrorKey(buildError(404, { code: 'user_not_found' }))).toBe('notFound');
    expect(getActivationErrorKey(buildError(404))).toBe('notFound');
  });

  it('reports a rate limit', () => {
    expect(getActivationErrorKey(buildError(429, { code: 'rate_limited' }))).toBe('rateLimited');
  });

  it.each([500, 502, 503])('treats a %i as the service being unavailable', (status) => {
    expect(getActivationErrorKey(buildError(status))).toBe('unavailable');
  });

  it('treats a request that never reached the server as unavailable', () => {
    expect(getActivationErrorKey(buildError())).toBe('unavailable');
  });

  it('falls back to a generic message for anything else', () => {
    expect(getActivationErrorKey(buildError(400, { code: 'bad_request' }))).toBe('unknown');
    expect(getActivationErrorKey(buildError(403, 'forbidden'))).toBe('unknown');
  });
});
