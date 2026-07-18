import { formatLimit } from '../formatLimit';

describe('formatLimit', () => {
  it('maps null to the unlimited label', () => {
    expect(formatLimit(null, '∞')).toBe('∞');
  });

  it('renders numeric limits as strings', () => {
    expect(formatLimit(10, '∞')).toBe('10');
    expect(formatLimit(0, '∞')).toBe('0');
  });
});
