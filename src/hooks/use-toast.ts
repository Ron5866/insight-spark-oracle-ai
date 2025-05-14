
import { ReactNode } from "react";

type ToastProps = {
  title?: string;
  description?: ReactNode;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

const toastState: {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
  dismissToast: (index: number) => void;
} = {
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      toastState.addToast(props);
    },
    dismiss: (index: number) => {
      toastState.dismissToast(index);
    },
  };
}

export const toast = (props: ToastProps) => {
  toastState.addToast(props);
};

