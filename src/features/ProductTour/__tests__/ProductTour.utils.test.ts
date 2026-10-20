import { findTourElement, tourSelector, tourTarget } from '../ProductTour.utils';

// jsdom has no layout, so every element would count as hidden; `data-hidden` marks the ones that should.
beforeAll(() => {
  jest.spyOn(Element.prototype, 'getClientRects').mockImplementation(function (this: Element) {
    return (this.hasAttribute('data-hidden') ? [] : [{}]) as unknown as DOMRectList;
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('tourTarget', () => {
  it('returns the attribute that marks an element as a stop of the tour', () => {
    expect(tourTarget('nav-clients')).toEqual({ 'data-tour': 'nav-clients' });
  });
});

describe('tourSelector', () => {
  it('builds the selector that finds a marked element', () => {
    expect(tourSelector('nav-analytics')).toBe('[data-tour="nav-analytics"]');
  });

  it('finds the element carrying the matching attribute', () => {
    document.body.innerHTML = `<a data-tour="nav-programs">Programs</a><a data-tour="nav-clients">Clients</a>`;

    expect(document.querySelector(tourSelector('nav-programs'))?.textContent).toBe('Programs');
  });
});

describe('findTourElement', () => {
  const targets = ['nav-clients', 'card-clients'] as const;

  it('prefers the first target', () => {
    document.body.innerHTML = '<a id="card" data-tour="card-clients"></a><a id="nav" data-tour="nav-clients"></a>';

    expect(findTourElement(targets)?.id).toBe('nav');
  });

  it('falls back to the next target when the first is not on the page', () => {
    document.body.innerHTML = '<a id="card" data-tour="card-clients"></a>';

    expect(findTourElement(targets)?.id).toBe('card');
  });

  it('falls back to the next target when the first is on the page but hidden', () => {
    document.body.innerHTML =
      '<a id="nav" data-hidden data-tour="nav-clients"></a><a id="card" data-tour="card-clients"></a>';

    expect(findTourElement(targets)?.id).toBe('card');
  });

  it('returns nothing when no target is shown', () => {
    document.body.innerHTML = '<a data-hidden data-tour="nav-clients"></a>';

    expect(findTourElement(targets)).toBeUndefined();
  });
});
