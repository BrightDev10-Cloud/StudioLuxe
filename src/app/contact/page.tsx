import ContactForm from "@/components/Contact/ContactForm";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact | StudioLuxe",
  description: "Start your project with StudioLuxe.",
};

export default function ContactPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.intro}>
        <h1 className={styles.heading}>Let's build<br/>something iconic.</h1>
        <p className={styles.subHeading}>
            Tell us about your project. We'll analyze your needs and get back to you with a tailored proposal.
        </p>
      </div>
      
      <ContactForm />
    </main>
  );
}
