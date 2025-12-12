"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./ContactForm.module.css";
import { submitContactForm } from "@/app/contact/actions";
import { useState } from "react";
import FeedbackModal from "../UI/FeedbackModal";

// Schema
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  budget: z.enum(["<5k", "5k-10k", "10k-50k", "50k+"], {
    errorMap: () => ({ message: "Please select a budget range" }),
  }),
  goals: z.string().min(10, "Please tell us a bit more about your goals"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data); 
      
      if (result.success) {
        setModalState({
          isOpen: true,
          type: "success",
          title: "Message Received",
          message: "Thank you for submitting this request. We will analyze it and send you a personalized report shortly."
        });
        reset();
      } else {
        setModalState({
          isOpen: true,
          type: "error",
          title: "Transmission Failed",
          message: result.error || "Something went wrong. Please check your connection and try again."
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        title: "System Error",
        message: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <FeedbackModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>01. What&apos;s your name?</label>
          <input 
            {...register("name")} 
            className={styles.input} 
            placeholder="John Doe" 
            autoComplete="name"
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>02. What&apos;s your email?</label>
          <input 
            {...register("email")} 
            type="email" 
            className={styles.input} 
            placeholder="john@example.com" 
            autoComplete="email"
          />
           {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>03. Company Website (Optional)</label>
          <input 
            {...register("website")} 
            className={styles.input} 
            placeholder="https://studio.luxe" 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>04. Project Budget (USD)</label>
          <select {...register("budget")} className={styles.select} defaultValue="">
            <option value="" disabled>Select a range</option>
            <option value="<5k">&lt; $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-50k">$10,000 - $50,000</option>
            <option value="50k+">$50,000+</option>
          </select>
          {errors.budget && <span className={styles.error}>{errors.budget.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>05. Tell us about your goals</label>
          <textarea 
            {...register("goals")} 
            className={styles.textarea} 
            placeholder="We want to build..." 
          />
          {errors.goals && <span className={styles.error}>{errors.goals.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? "Processing..." : "Submit Request ↗"}
        </button>

      </form>
    </>
  );
}
