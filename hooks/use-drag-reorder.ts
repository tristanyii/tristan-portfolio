"use client";

import { useState, useCallback, useRef } from "react";
import { useAdmin } from "@/components/admin-provider";

export function useDragReorder<T>(
  items: T[],
  orderKey: string,
  keyFn: (item: T, index: number) => string,
) {
  const { isAdmin, getContent, setContent } = useAdmin();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  /** Synced in drag start/end/drop — onDrop must not rely on async dragIdx state */
  const dragIdxRef = useRef<number | null>(null);

  const keys = items.map((item, i) => keyFn(item, i));

  const storedRaw = getContent(orderKey, "");
  let storedOrder: string[] = [];
  try { storedOrder = storedRaw ? JSON.parse(storedRaw) : []; } catch { storedOrder = []; }

  const ordered: T[] = [];
  const keyToItem = new Map<string, T>();
  keys.forEach((k, i) => keyToItem.set(k, items[i]));

  const usedKeys = new Set<string>();
  for (const k of storedOrder) {
    const item = keyToItem.get(k);
    if (item !== undefined) {
      ordered.push(item);
      usedKeys.add(k);
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (!usedKeys.has(keys[i])) ordered.push(items[i]);
  }

  const orderedKeys = ordered.map((item) => {
    const origIdx = items.indexOf(item);
    return keys[origIdx];
  });

  const onDragStart = useCallback((idx: number, e: React.DragEvent) => {
    dragIdxRef.current = idx;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    const el = e.currentTarget as HTMLElement;
    el.classList.add("dragging");
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.classList.remove("dragging");
    dragIdxRef.current = null;
    setDragIdx(null);
    setOverIdx(null);
  }, []);

  /** Use dragOver (not enter/leave) so nested children do not break hover index */
  const onDragOverRow = useCallback((idx: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(idx);
  }, []);

  const onDrop = useCallback(
    (targetIdx: number, e: React.DragEvent) => {
      e.preventDefault();
      const from = dragIdxRef.current;
      if (from === null || from === targetIdx) return;

      const newOrder = [...orderedKeys];
      const [moved] = newOrder.splice(from, 1);
      newOrder.splice(targetIdx, 0, moved);
      setContent(orderKey, JSON.stringify(newOrder));

      dragIdxRef.current = null;
      setDragIdx(null);
      setOverIdx(null);
    },
    [orderedKeys, orderKey, setContent],
  );

  const dragHandleProps = (idx: number) => ({
    draggable: true as const,
    onDragStart: (e: React.DragEvent) => onDragStart(idx, e),
    onDragEnd,
  });

  const dropTargetProps = (idx: number) => ({
    onDragOver: (e: React.DragEvent) => onDragOverRow(idx, e),
    onDrop: (e: React.DragEvent) => onDrop(idx, e),
  });

  return {
    orderedItems: ordered,
    dragIdx,
    overIdx,
    isAdmin,
    /** Drag starts from handle only (avoids native image/text drag stealing reorder) */
    bindDragHandle: (idx: number) => (isAdmin ? dragHandleProps(idx) : {}),
    /** Drop target — row container */
    bindDropTarget: (idx: number) => (isAdmin ? dropTargetProps(idx) : {}),
    bind: (idx: number) =>
      isAdmin
        ? {
            ...dragHandleProps(idx),
            ...dropTargetProps(idx),
          }
        : {},
  };
}
