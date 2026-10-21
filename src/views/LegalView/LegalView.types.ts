/** One section of a legal text, as it is written in the `PrivacyPolicy` / `TermsOfService` messages. */
export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items: string[];
  /** A paragraph that comes after the list. */
  closing?: string;
};

export type LegalDocument = {
  title: string;
  intro: string[];
  sections: LegalSection[];
};

/** The two legal texts; each is a messages namespace and a page. */
export type LegalDocumentName = 'PrivacyPolicy' | 'TermsOfService';
