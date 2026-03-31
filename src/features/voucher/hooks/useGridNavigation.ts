/**
 * useGridNavigation — single source of truth for all keyboard behaviour.
 *
 * Stores:
 *   gridRef        Map<rowId, HTMLInputElement[]>   — ref registry per row
 *   focusPendingRef { rowId, col } | null           — consumed by new row on mount
 *
 * The ONLY place `.focus()` is called outside this hook is inside VoucherRow
 * via the focusPendingRef consumption pattern (see architecture doc).
 */

import { useRef, useCallback, MutableRefObject } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { VoucherForm, emptyItemRow } from "../schema";

export const COLUMNS = ["particulars", "qty", "uom", "rate", "discount", "amount"] as const;
export const COL_COUNT = COLUMNS.length;

export interface FocusPending {
  rowId: string;
  col: number;
}

export function useGridNavigation(fieldArray: UseFieldArrayReturn<VoucherForm, "items">) {
  const gridRef         = useRef<Map<string, (HTMLInputElement | null)[]>>(new Map());
  const focusPendingRef = useRef<FocusPending | null>(null);

  // Called by each VoucherRow to register its cells
  const registerCell = useCallback(
    (rowId: string, colIndex: number, el: HTMLInputElement | null) => {
      if (!gridRef.current.has(rowId)) {
        gridRef.current.set(rowId, Array(COL_COUNT).fill(null));
      }
      const row = gridRef.current.get(rowId)!;
      row[colIndex] = el;
    },
    []
  );

  // Called by VoucherRow on unmount to clean up
  const unregisterRow = useCallback((rowId: string) => {
    gridRef.current.delete(rowId);
  }, []);

  // Imperatively focus a specific cell by rowId + column
  const focusCell = useCallback((rowId: string, col: number) => {
    const cells = gridRef.current.get(rowId);
    cells?.[col]?.focus();
  }, []);

  // Navigate to adjacent cell; add row if on last cell of last row
  const navigate = useCallback(
    (currentRowId: string, currentCol: number, direction: "next" | "prev") => {
      const fields = fieldArray.fields;
      const rowIndex = fields.findIndex((f) => f.id === currentRowId);
      if (rowIndex === -1) return;

      if (direction === "next") {
        const nextCol = currentCol + 1;
        if (nextCol < COL_COUNT) {
          // Move right within row
          focusCell(currentRowId, nextCol);
        } else if (rowIndex < fields.length - 1) {
          // Move to first cell of next row
          focusCell(fields[rowIndex + 1].id, 0);
        } else {
          // Last cell of last row → append new row
          appendRow();
        }
      } else {
        const prevCol = currentCol - 1;
        if (prevCol >= 0) {
          focusCell(currentRowId, prevCol);
        } else if (rowIndex > 0) {
          focusCell(fields[rowIndex - 1].id, COL_COUNT - 1);
        }
      }
    },
    [fieldArray.fields, focusCell]
  );

  // Append a new row and set focus intent (consumed by the new VoucherRow on mount)
  const appendRow = useCallback(() => {
    const newRow = emptyItemRow();
    // fieldArray.append returns void — but the new field.id is assigned
    // We need to read it after append. useFieldArray assigns IDs synchronously.
    fieldArray.append(newRow);

    // We set a "broadcast" pending focus. The new row's useEffect will pick it up.
    // It works because we flag "last row, first column" — the new row recognises
    // it's the most recent and claims the focus intent.
    focusPendingRef.current = { rowId: "__LAST__", col: 0 };
  }, [fieldArray]);

  // Remove a row by index; refocus the row above (or below if first row)
  const removeRow = useCallback(
    (rowIndex: number) => {
      const fields = fieldArray.fields;
      if (fields.length <= 1) return; // Always keep at least one row

      fieldArray.remove(rowIndex);

      // Focus the row above; if removing first row, focus new first row
      const targetIndex = Math.max(0, rowIndex - 1);
      const targetId = fields[rowIndex === 0 ? 1 : targetIndex]?.id;
      if (targetId) {
        // Small defer needed here — remove causes re-render before we can focus
        requestAnimationFrame(() => focusCell(targetId, 0));
      }
    },
    [fieldArray, focusCell]
  );

  return {
    gridRef,
    focusPendingRef,
    registerCell,
    unregisterRow,
    focusCell,
    navigate,
    appendRow,
    removeRow,
  };
}

export type GridNavigation = ReturnType<typeof useGridNavigation>;
