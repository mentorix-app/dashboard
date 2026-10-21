import { SUPPORT_EMAIL } from '@/src/shared/lib';
import { formatLegalDate, readLegalDocument, splitAroundEmail } from '../LegalView.utils';

describe('readLegalDocument', () => {
  const section = { id: 'a', title: 'A', paragraphs: ['p'], items: ['i'], closing: 'c' };

  it('reads a well-formed text', () => {
    expect(readLegalDocument('Title', ['intro'], [section])).toEqual({
      title: 'Title',
      intro: ['intro'],
      sections: [section],
    });
  });

  it('treats a section without paragraphs, items or a closing as having none', () => {
    expect(readLegalDocument('T', [], [{ id: 'a', title: 'A' }]).sections).toEqual([
      { id: 'a', title: 'A', paragraphs: [], items: [] },
    ]);
  });

  it.each([
    ['an intro that is not a list of strings', { intro: 'text', sections: [] }],
    ['an intro with a non-string entry', { intro: [1], sections: [] }],
    ['sections that are not a list', { intro: [], sections: {} }],
    ['a section without an id', { intro: [], sections: [{ title: 'A' }] }],
    ['a section without a title', { intro: [], sections: [{ id: 'a' }] }],
    ['a section that is not an object', { intro: [], sections: ['a'] }],
    ['paragraphs of the wrong type', { intro: [], sections: [{ id: 'a', title: 'A', paragraphs: 'p' }] }],
    ['items of the wrong type', { intro: [], sections: [{ id: 'a', title: 'A', items: [1] }] }],
    ['a closing of the wrong type', { intro: [], sections: [{ id: 'a', title: 'A', closing: 1 }] }],
  ])('refuses %s', (_, { intro, sections }) => {
    expect(() => readLegalDocument('T', intro, sections)).toThrow();
  });
});

describe('formatLegalDate', () => {
  it('writes the version as a long date in the page language', () => {
    expect(formatLegalDate('2026-10-21', 'en')).toBe('October 21, 2026');
    expect(formatLegalDate('2026-10-21', 'ru')).toBe('21 октября 2026 г.');
  });

  it('does not slip a day with the time zone of the machine', () => {
    expect(formatLegalDate('2026-01-01', 'en')).toBe('January 1, 2026');
  });
});

describe('splitAroundEmail', () => {
  it('leaves a text without the email as one piece', () => {
    expect(splitAroundEmail('No address here')).toEqual([{ kind: 'text', value: 'No address here' }]);
  });

  it('marks the email between two pieces of text', () => {
    expect(splitAroundEmail(`Write to ${SUPPORT_EMAIL} today.`)).toEqual([
      { kind: 'text', value: 'Write to ' },
      { kind: 'email', value: SUPPORT_EMAIL },
      { kind: 'text', value: ' today.' },
    ]);
  });

  it('handles a text that is only the email, and several of them', () => {
    expect(splitAroundEmail(SUPPORT_EMAIL)).toEqual([{ kind: 'email', value: SUPPORT_EMAIL }]);
    expect(splitAroundEmail(`${SUPPORT_EMAIL} or ${SUPPORT_EMAIL}`)).toHaveLength(3);
  });
});
