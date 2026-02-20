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

  const value = getContent(contentKey, defaultValue);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing]);

  const save = useCallback(() => {
    const v = draft.trim();
    if (v && v !== value) setContent(contentKey, v);
    setEditing(false);
  }, [draft, value, contentKey, setContent]);

  if (!isAdmin) return <Component className={className}>{value}</Component>;

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
            onKeyDown={(e: KeyboardEvent) => e.key === "Escape" && setEditing(false)}
          />
        ) : (
          <input
            {...shared}
            ref={ref}
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
      {value}
      <Pencil className="inline-block w-3 h-3 ml-1.5 opacity-0 group-hover/edit:opacity-60 transition-opacity align-middle" />
    </Component>
  );
}
