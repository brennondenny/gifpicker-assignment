import { useState, useCallback } from "react";

interface ToastState {
  message: string;
  isVisible: boolean;
}

interface UseToastReturn {
  message: string;
  isVisible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    isVisible: false,
  });

  const show = useCallback((message: string) => {
    setToast({ message, isVisible: true });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  const hide = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    message: toast.message,
    isVisible: toast.isVisible,
    show,
    hide,
  };
}
