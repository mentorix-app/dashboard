export type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isPending?: boolean;
  confirmVariant?: 'default' | 'destructive';
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};
