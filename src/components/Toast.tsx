import React from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default React.memo(function Toast({ message, isVisible }: ToastProps) {
  return (
    <div
      className={`${styles.toast} ${isVisible ? styles.visible : ""}`}
      role="status"
    >
      {message}
    </div>
  );
});
