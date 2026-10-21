import enLegal from '../../../../i18n/messages/en/legal.json';
import enLanding from '../../../../i18n/messages/en/landing.json';
import enLogin from '../../../../i18n/messages/en/loginPage.json';
import enOnboarding from '../../../../i18n/messages/en/trainerOnboarding.json';
import enPrivacy from '../../../../i18n/messages/en/privacyPolicy.json';
import enTerms from '../../../../i18n/messages/en/termsOfService.json';
import ruLegal from '../../../../i18n/messages/ru/legal.json';
import ruLanding from '../../../../i18n/messages/ru/landing.json';
import ruLogin from '../../../../i18n/messages/ru/loginPage.json';
import ruOnboarding from '../../../../i18n/messages/ru/trainerOnboarding.json';
import ruPrivacy from '../../../../i18n/messages/ru/privacyPolicy.json';
import ruTerms from '../../../../i18n/messages/ru/termsOfService.json';
import { SUPPORT_EMAIL } from '@/src/shared/lib';
import { readLegalDocument } from '../LegalView.utils';

const documents = [
  ['Privacy Policy', enPrivacy, ruPrivacy],
  ['Terms of Service', enTerms, ruTerms],
] as const;

describe.each(documents)('%s texts', (_, en, ru) => {
  it.each([
    ['English', en],
    ['Russian', ru],
  ])('%s has the shape the page expects', (__, messages) => {
    expect(() => readLegalDocument(messages.title, messages.intro, messages.sections)).not.toThrow();
  });

  it('has the same sections, in the same order, in both languages', () => {
    expect(ru.sections.map((section) => section.id)).toEqual(en.sections.map((section) => section.id));
  });

  it('gives every section a unique id (they are anchors of the contents list)', () => {
    const ids = en.sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each([
    ['English', en],
    ['Russian', ru],
  ])('%s names the contact address in a contact section', (__, messages) => {
    const contact = messages.sections.find((section) => section.id === 'contact');
    expect((contact?.paragraphs ?? []).join(' ')).toContain(SUPPORT_EMAIL);
  });

  it('has a page title and a search description in both languages', () => {
    for (const messages of [en, ru]) {
      expect(messages.title).not.toBe('');
      expect(messages.metaTitle).not.toBe('');
      expect(messages.metaDescription).not.toBe('');
    }
  });
});

describe('Privacy Policy and Google', () => {
  const textOf = (messages: typeof enPrivacy) => JSON.stringify(messages.sections) + JSON.stringify(messages.intro);

  it.each([
    ['English', enPrivacy],
    ['Russian', ruPrivacy],
  ])('%s says which Google scopes are used, and carries the Limited Use statement', (__, messages) => {
    const text = textOf(messages);
    expect(text).toContain('openid');
    expect(text).toContain('Google API Services User Data Policy');
    expect(text).toContain('Limited Use');
  });

  it.each([
    ['English', enPrivacy],
    ['Russian', ruPrivacy],
  ])('%s tells how to delete the account', (__, messages) => {
    expect(messages.sections.some((section) => section.id === 'your-rights')).toBe(true);
  });
});

describe('labels of the legal pages', () => {
  it('have the same keys in both languages', () => {
    expect(Object.keys(ruLegal).sort()).toEqual(Object.keys(enLegal).sort());
    expect(Object.keys(ruLanding.footer.links).sort()).toEqual(Object.keys(enLanding.footer.links).sort());
    expect(Object.keys(ruOnboarding.terms).sort()).toEqual(Object.keys(enOnboarding.terms).sort());
  });

  it.each([
    ['English', enLogin.legalNotice],
    ['Russian', ruLogin.legalNotice],
  ])('%s sign-in notice has both links', (__, notice) => {
    expect(notice).toMatch(/<terms>.+<\/terms>/);
    expect(notice).toMatch(/<privacy>.+<\/privacy>/);
  });
});
