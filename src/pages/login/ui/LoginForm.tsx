'use client';

import { useState, type FC, type FormEvent } from 'react';

import { Button, Input, Label } from '@/src/shared/ui';

export type LoginFormLabels = {
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
};

const usernameId = 'login-username';
const passwordId = 'login-password';

export const LoginForm: FC<{ labels: LoginFormLabels }> = ({ labels }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor={usernameId}>{labels.usernameLabel}</Label>
        <Input
          id={usernameId}
          name="username"
          type="text"
          autoComplete="username"
          placeholder={labels.usernamePlaceholder}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
          aria-required="true"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={passwordId}>{labels.passwordLabel}</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={labels.passwordPlaceholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
          aria-required="true"
        />
      </div>
      <Button className="w-full" type="submit" size="lg">
        {labels.submitLabel}
      </Button>
    </form>
  );
};
