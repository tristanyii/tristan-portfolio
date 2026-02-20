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
  const dragCounter = useRef(0);

  const keys = items.map(keyFn);

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
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    const el = e.currentTarget as HTMLElement;
    el.classList.add("dragging");
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.classList.remove("dragging");
    setDragIdx(null);
    setOverIdx(null);
    dragCounter.current = 0;
  }, []);

  const onDragEnter = useCallback((idx: number) => {
    dragCounter.current++;
    setOverIdx(idx);
  }, []);

  const onDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setOverIdx(null);
      dragCounter.current = 0;
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;

    const newOrder = [...orderedKeys];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setContent(orderKey, JSON.stringify(newOrder));

    setDragIdx(null);
    setOverIdx(null);
    dragCounter.current = 0;
  }, [dragIdx, orderedKeys, orderKey, setContent]);

  return {
    orderedItems: ordered,
    dragIdx,
    overIdx,
    isAdmin,
    bind: (idx: number) =>
      isAdmin
        ? {
            draggable: true,
            onDragStart: (e: React.DragEvent) => onDragStart(idx, e),
            onDragEnd,
            onDragEnter: () => onDragEnter(idx),
            onDragLeave,
            onDragOver,
            onDrop: (e: React.DragEvent) => onDrop(idx, e),
          }
        : {},
  };
}
