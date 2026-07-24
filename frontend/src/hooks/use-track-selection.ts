import { useState } from "react";

type UseTrackSelectionOptions = {
  initialSelected?: string[];
  onChange?: (selected: string[]) => void;
};

export function useTrackSelection(ids: string[], options?: UseTrackSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(options?.initialSelected ?? ids),
  );

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      options?.onChange?.([...next]);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = prev.size === ids.length ? new Set<string>() : new Set(ids);

      options?.onChange?.([...next]);
      return next;
    });
  }

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isAllSelected: selectedIds.size === ids.length,
    toggle,
    toggleAll,
  };
}
