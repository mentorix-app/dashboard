import '@testing-library/jest-dom';
import type { AnchorHTMLAttributes, ImgHTMLAttributes, PropsWithChildren } from 'react';

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
