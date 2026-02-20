"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { useAdmin } from "./admin-provider";
import { Pencil } from "lucide-react";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  adminClassName?: string;
}

const BLANK = "\u200B";

export function EditableText({
  contentKey,
  defaultValue,
  as: Component = "span",
  className = "",
  multiline = false,
  adminClassName = "",
}: Props) {
  const { isAdmin, getContent, setContent } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const raw = getContent(contentKey, defaultValue);
  const isBlank = raw === BLANK || raw.trim() === "";
  const value = isBlank ? "" : raw;

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing]);

  const save = useCallback(() => {
    const v = draft.trim();
    if (v === value) { setEditing(false); return; }
    // Save blank marker when user clears the field
    setContent(contentKey, v || BLANK);
    setEditing(false);
  }, [draft, value, contentKey, setContent]);

  // Non-admin: hide entirely if blank
  if (!isAdmin) {
    if (isBlank) return null;
    return <Component className={className}>{value}</Component>;
  }

  if (editing) {
    const shared = {
      ref: ref as React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
      value: draft,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: save,
      className: "bg-transparent outline-none w-full border-b-2 border-primary/40 focus:border-primary px-1 py-0.5",
      style: { font: "inherit", color: "inherit", letterSpacing: "inherit" } as React.CSSProperties,
    };

    return (
      <Component className={className} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            {...shared}
            ref={ref}
            rows={3}
            placeholder="Leave empty to hide"
            onKeyDown={(e: KeyboardEvent) => e.key === "Escape" && setEditing(false)}
          />
        ) : (
          <input
            {...shared}
            ref={ref}
            placeholder="Leave empty to hide"
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
          />
        )}
      </Component>
    );
  }

  return (
    <Component
      className={`${className} admin-editable ${adminClassName} group/edit`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDraft(value);
        setEditing(true);
      }}
    >
      {isBlank ? "\u00A0" : value}
      <Pencil className="inline-block w-3 h-3 ml-1.5 opacity-0 group-hover/edit:opacity-60 transition-opacity align-middle" />
    </Component>
  );
}
