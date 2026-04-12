import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hello } from '@/components/hello';

describe('Hello', () => {
  it('renders the default greeting', () => {
    render(<Hello />);
    expect(screen.getByRole('heading', { name: /hello, world/i })).toBeInTheDocument();
  });

  it('renders a custom name', () => {
    render(<Hello name="Mentorix" />);
    expect(screen.getByRole('heading', { name: /hello, mentorix/i })).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Hello name="Snapshot" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('supports user interaction on a button (RTL + user-event)', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <div>
        <Hello name="Test" />
        <button type="button" onClick={handleClick}>
          Click
        </button>
      </div>
    );

    await user.click(screen.getByRole('button', { name: /click/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
