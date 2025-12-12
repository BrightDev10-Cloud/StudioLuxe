import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";
import { FaHourglassHalf } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className={styles.container}>
      {/* Generated 404 Graphic */}
      <Image
        src="/assets/pixel_404_face.png"
        alt="404 Pixel Face"
        width={600}
        height={300}
        className={styles.graphic}
      />
      
      <h1 className={styles.title}>
        INVALID
        <br />
        <span><FaHourglassHalf className={styles.icon} /> URL</span>
      </h1>

      <Link href="/" className={styles.homeLink}>
        Return Home
      </Link>
    </div>
  );
}
