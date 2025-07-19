"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { toast } from "react-hot-toast";
import css from "./NoteForm.module.css";
import { Tag } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useEffect } from "react";

export default function NoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const tag = formData.get("tag")?.toString() as Tag;

    if (!title || !content || !tag) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await createNote({ title, content, tag });
      clearDraft();
      toast.success("Note created successfully");
      router.push("/notes");
    } finally {
      setIsSubmitting(false);
    }
  };
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<Tag>(draft.tag as Tag);

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          required
          maxLength={500}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          defaultValue="Todo"
          onChange={(e) => setTag(e.target.value as Tag)}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <button
        type="submit"
        className={css.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create note"}
      </button>
    </form>
  );
}
