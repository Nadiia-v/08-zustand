import { fetchNotes } from "@/lib/api";
import { getSingleNote } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  if (!id || id === "All") {
    return {
      title: "All Notes",
      description: "Browse all your saved notes.",
    };
  }
  const note = await getSingleNote(id);

  if (!note) {
    return {
      title: "Note not found",
      description: "The requested note could not be found.",
    };
  }

  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://07-routing-nextjs-rust.vercel.app/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 600,
          height: 400,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || "All";

  const initialData = await fetchNotes({ tag, page: 1 });

  return <NotesClient initialData={initialData} tag={tag} />;
}
