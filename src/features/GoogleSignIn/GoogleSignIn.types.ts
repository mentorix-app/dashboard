export type GoogleCredentialResponse = {
  /** The Google ID token (JWT) the API verifies. */
  credential: string;
};

type GoogleIdConfiguration = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  /** Hex SHA-256 of the raw nonce; Google copies it into the ID token. */
  nonce: string;
  auto_select?: boolean;
};

type GoogleButtonConfiguration = {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill';
  width?: number;
  locale?: string;
};

// Only the part of Google Identity Services the dashboard uses.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (configuration: GoogleIdConfiguration) => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
        };
      };
    };
  }
}

export type GoogleSignInStatus = 'loading' | 'ready' | 'unavailable';
