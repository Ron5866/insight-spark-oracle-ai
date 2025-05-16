
import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: ReactNode;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: ToastProps) => void;
  dismiss: (index: number) => void;
};

// Create a context with default values
const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = props.id || String(Math.random());
    setToasts((prev) => [...prev, { ...props, id }]);
  };

  const dismiss = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  const value = {
    toasts,
    toast,
    dismiss,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

export const toast = (props: ToastProps) => {
  // This is a convenience function for use outside of React components
  // Implementation will be overridden when provider mounts
  console.warn("Toast was called before ToastProvider was mounted");
};
