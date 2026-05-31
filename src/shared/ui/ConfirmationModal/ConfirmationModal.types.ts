export type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};
