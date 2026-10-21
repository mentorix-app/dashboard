export type FooterLink = {
  /** Key of the label in the `Legal` messages. */
  key: 'privacy' | 'terms' | 'contact';
  href: string;
  internal: boolean;
};
