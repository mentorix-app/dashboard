import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';

import { useOnboardingStore } from '@/src/entities/onboarding';
import { UserRole, useUserStore } from '@/src/entities/user';
import { useSidebar } from '@/src/shared/ui';
import { UserAvatar } from '../UserAvatar';

const mockPush = jest.fn();
let mockPathname = '/exercises';

jest.mock('../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
  Link: ({ children, ...props }: { href: string; children: ReactNode }) => createElement('a', props, children),
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('../../../entities/auth', () => ({ logoutAction: jest.fn() }));
jest.mock('../../../shared/ui', () => ({
  ...jest.requireActual('../../../shared/ui'),
  useSidebar: jest.fn(),
}));

const mockedSidebar = useSidebar as jest.Mock;

const openMenu = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'avatarLabel' }));
  return user;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockPathname = '/exercises';
  mockedSidebar.mockReturnValue({ isMobile: false });
  act(() => {
    useOnboardingStore.setState({ tourRequested: false });
    useUserStore.setState({
      user: { userId: 'u1', email: 'ada@example.com', createdAt: '2026-10-01T00:00:00Z', roles: [UserRole.Trainer] },
    });
  });
});

describe('UserAvatar', () => {
  it('offers the profile, the tour and logging out', async () => {
    render(<UserAvatar />);

    await openMenu();

    expect(screen.getByRole('menuitem', { name: 'profile' })).toHaveAttribute('href', '/user/u1/subscription');
    expect(screen.getByRole('menuitem', { name: 'showTour' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'logout' })).toBeInTheDocument();
  });

  it('asks for the product tour to be shown again, staying on the page where the sidebar is', async () => {
    render(<UserAvatar />);
    const user = await openMenu();

    await user.click(screen.getByRole('menuitem', { name: 'showTour' }));

    expect(useOnboardingStore.getState().tourRequested).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('opens the dashboard first on a phone, where the tour points at its cards', async () => {
    mockedSidebar.mockReturnValue({ isMobile: true });
    render(<UserAvatar />);
    const user = await openMenu();

    await user.click(screen.getByRole('menuitem', { name: 'showTour' }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(useOnboardingStore.getState().tourRequested).toBe(true);
  });

  it('does not navigate on a phone that is already on the dashboard', async () => {
    mockedSidebar.mockReturnValue({ isMobile: true });
    mockPathname = '/dashboard';
    render(<UserAvatar />);
    const user = await openMenu();

    await user.click(screen.getByRole('menuitem', { name: 'showTour' }));

    expect(mockPush).not.toHaveBeenCalled();
    expect(useOnboardingStore.getState().tourRequested).toBe(true);
  });
});
