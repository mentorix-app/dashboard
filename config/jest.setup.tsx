import '@testing-library/jest-dom';
import type { AnchorHTMLAttributes, ImgHTMLAttributes, PropsWithChildren } from 'react';

// Modules like `session.crypto.ts` read `process.env.SESSION_SECRET` at import
// time. ES import statements are hoisted above other top-level statements when
// compiled, so a test file setting `process.env.SESSION_SECRET` in its own
// source (below its imports) runs too late to protect that file's *own* first
// import of such a module — it only appeared to work locally because an
// earlier test file in the same Jest worker had already set it on the shared
// `process.env`, which is order/worker-assignment dependent and not guaranteed
// in CI. Setting it here, in `setupFilesAfterEnv`, runs before every test
// file's module graph is evaluated, so it's always defined in time.
process.env.SESSION_SECRET ??= 'test-session-secret';

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src?: string }) {
    /* next/image is mocked for tests — plain img is intentional */
    return (
      // eslint-disable-next-line @next/next/no-img-element -- test mock for next/image
      <img src={src} alt={alt} {...rest} />
    );
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: PropsWithChildren<{ href: string }> & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
