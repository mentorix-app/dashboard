'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { useLocale } from '@/i18n';
import { googleSignInAction, prepareGoogleSignInAction, type AuthFailure } from '@/src/entities/auth';
import { GOOGLE_BUTTON_MAX_WIDTH, GOOGLE_BUTTON_MIN_WIDTH } from './GoogleSignIn.constants';
import type { GoogleCredentialResponse, GoogleSignInStatus } from './GoogleSignIn.types';
import { clampButtonWidth, loadGoogleScript } from './GoogleSignIn.utils';

export const useGoogleSignInConfig = () => {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [status, setStatus] = useState<GoogleSignInStatus>(clientId ? 'loading' : 'unavailable');
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  // Bumped after a failed attempt: a nonce is single-use, so the button is set up again with a fresh one.
  const [attempt, setAttempt] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleCredential = useCallback((response: GoogleCredentialResponse) => {
    setFailure(null);
    startTransition(async () => {
      const result = await googleSignInAction(response.credential);
      if (!result) return;
      setFailure(result);
      setAttempt((value) => value + 1);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!clientId || !container) return;

    let cancelled = false;

    const setUp = async () => {
      const [{ nonce }] = await Promise.all([prepareGoogleSignInAction(), loadGoogleScript()]);
      if (cancelled) return;

      const identity = window.google?.accounts.id;
      if (!identity) {
        setStatus('unavailable');
        return;
      }

      identity.initialize({ client_id: clientId, nonce, callback: handleCredential, auto_select: false });
      container.replaceChildren();
      identity.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: clampButtonWidth(container.offsetWidth, GOOGLE_BUTTON_MIN_WIDTH, GOOGLE_BUTTON_MAX_WIDTH),
        locale,
      });
      setStatus('ready');
    };

    setUp().catch(() => {
      if (!cancelled) setStatus('unavailable');
    });

    return () => {
      cancelled = true;
    };
  }, [attempt, clientId, handleCredential, locale]);

  return { containerRef, status, failure, isPending };
};
