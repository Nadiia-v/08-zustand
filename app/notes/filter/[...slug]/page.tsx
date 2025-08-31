import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || "All";

  return {
    title: tag === "All" ? "All Notes" : `Notes tagged with "${tag}"`,
    description:
      tag === "All"
        ? "Browse all your saved notes."
        : `Filtered notes by tag: "${tag}".`,
    openGraph: {
      title: tag === "All" ? "All Notes" : `Notes tagged with "${tag}"`,
      description:
        tag === "All"
          ? "Browse all your saved notes."
          : `Notes tagged with "${tag}"`,
      url: `https://07-routing-nextjs-rust.vercel.app/notes/filter/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 600,
          height: 400,
          alt: `NoteHub tag view`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tags = resolvedParams.slug?.[0] ?? "All";
  const tag = tags === "All" ? undefined : tags;
  const initialData = await fetchNotes({ tag, page: 1 });

  return <NotesClient initialData={initialData} tag={tags} />;
}
