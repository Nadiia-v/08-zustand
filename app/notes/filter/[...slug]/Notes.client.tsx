"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useState, useEffect } from "react";
import type { Note } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./Page.module.css";
import React from "react";
import Link from "next/link";

interface Props {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
  tag: string;
}

export default function NotesClient({ initialData, tag }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, tag }),
    initialData,
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearchChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note
        </Link>
      </header>

      {data?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching notes</p>}

      {data?.notes.length ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
}
