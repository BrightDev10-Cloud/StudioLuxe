"use client";

import { useEffect } from "react";
import styles from "./FeedbackModal.module.css";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface FeedbackModalProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

export default function FeedbackModal({
  isOpen,
  type,
  title,
  message,
  onClose,
}: FeedbackModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}>
          <FaTimes />
        </button>
        
        <div className={styles.iconContainer}>
          {type === "success" ? (
            <FaCheckCircle className={styles.successIcon} />
          ) : (
            <FaExclamationTriangle className={styles.errorIcon} />
          )}
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <button onClick={onClose} className={styles.button}>
          {type === "success" ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
}
