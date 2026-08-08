import { useState } from "react";

export function useTrackSelection(ids: string[]) {
  

  const [selectedIds, setSelectedIds] = useState(
    () => new Set(ids),
  );



  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

    
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = prev.size === ids.length ? new Set<string>() : new Set(ids);

    
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
