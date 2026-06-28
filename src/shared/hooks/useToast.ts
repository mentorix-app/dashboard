'use client';

import { toast, type ExternalToast } from 'sonner';

type ShowToast = (message: string, options?: ExternalToast) => void;

export interface UseToastResult {
  showSuccessToast: ShowToast;
  showErrorToast: ShowToast;
}

const showSuccessToast: ShowToast = (message, options) => {
  toast.success(message, options);
};

const showErrorToast: ShowToast = (message, options) => {
  toast.error(message, options);
};

const toastApi: UseToastResult = { showSuccessToast, showErrorToast };

export const useToast = (): UseToastResult => toastApi;
