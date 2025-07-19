import Link from "next/link";
import css from "./Not-found.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Page you are looking for doesn`t exist.",
  openGraph: {
    title: "Page not found",
    description: "Page you are looking for doesn`t exist.",
    url: "https://07-routing-nextjs-rust.vercel.app/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application",
      },
    ],
  },
};

export default function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.description}>Сторінка не знайдена</p>
      <Link href="/" className={css.link}>
        Повернутись на головну
      </Link>
    </div>
  );
}
