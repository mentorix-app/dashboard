import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password · Mentorix',
  description: 'Reset your Mentorix account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-6 text-center shadow-sm">
      <h1 className="text-card-foreground mb-3 text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-muted-foreground text-sm">Password reset is coming soon.</p>
    </div>
  );
}
