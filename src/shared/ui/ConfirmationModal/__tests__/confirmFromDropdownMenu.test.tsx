import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../DropdownMenu';
import { confirm } from '../confirmStore';
import { ConfirmationModalHost } from '../ConfirmationModalHost';

const onConfirm = jest.fn();

const RowActions = () => (
  <>
    <DropdownMenu>
      <DropdownMenuTrigger>actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() =>
            confirm({
              title: 'Delete?',
              description: 'Gone for good',
              cancelLabel: 'cancel',
              confirmLabel: 'delete',
              onConfirm,
            })
          }
        >
          remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <ConfirmationModalHost />
  </>
);

const openConfirmFromMenu = async () => {
  const user = userEvent.setup();
  render(<RowActions />);
  await user.click(screen.getByRole('button', { name: 'actions' }));
  await user.click(screen.getByRole('menuitem', { name: 'remove' }));
  await screen.findByRole('dialog');
  return user;
};

beforeEach(() => {
  onConfirm.mockReset();
  document.body.style.pointerEvents = '';
});

describe('confirm() opened from a dropdown menu item', () => {
  it('leaves the page clickable after confirming', async () => {
    const user = await openConfirmFromMenu();

    await user.click(screen.getByRole('button', { name: 'delete' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(document.body.style.pointerEvents).toBe('');
  });

  it('leaves the page clickable after cancelling', async () => {
    const user = await openConfirmFromMenu();

    await user.click(screen.getByRole('button', { name: 'cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onConfirm).not.toHaveBeenCalled();
    expect(document.body.style.pointerEvents).toBe('');
  });
});
