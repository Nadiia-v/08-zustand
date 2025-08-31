import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Note } from "@/types/note";
import { getSingleNote } from "@/lib/api";
import type { Metadata } from "next";

interface PageParams {
  params: Promise<{ id: string }>;
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
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
      url: `https://notehub-api.goit.study/notes/${id}`,
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

export default async function NoteDetailsPage({ params }: PageParams) {
  const { id } = await params;
  const noteId = Number(id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const note = queryClient.getQueryData<Note>(["note", noteId]);
  if (!note) return null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient initialNote={note} />
    </HydrationBoundary>
  );
}
