import { useEffect, useState, useRef, useCallback } from "react";

export type UseSwipeTabsOptions<T extends string> = {
  tabs: readonly T[];
  defaultTab?: T;
};

export type UseSwipeTabsReturn<T extends string> = {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  handleTabChange: (val: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  containerProps: {
    onScroll: () => void;
    onTouchStart: () => void;
  };
};

/**
 * Hook for two-way synchronized continuous swipe navigation with tabs.
 * Supports 1:1 touch dragging, programmatic smooth scrolling, viewport resizing,
 * and edge bounds.
 */
export function useSwipeTabs<T extends string>({
  tabs,
  defaultTab,
}: UseSwipeTabsOptions<T>): UseSwipeTabsReturn<T> {
  const [activeTab, setActiveTab] = useState<T>(defaultTab ?? tabs[0]);
  const activeTabRef = useRef<T>(activeTab);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Keep scroll position aligned on container resize (e.g. orientation or window resize)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          const index = tabs.indexOf(activeTabRef.current);
          if (index >= 0) {
            container.scrollLeft = index * width;
          }
        }
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, [tabs]);

  // Listen to scrollend event when smooth programmatic scroll ends
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => {
      container.removeEventListener("scrollend", handleScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleTabChange = useCallback(
    (val: string) => {
      const tab = val as T;
      const targetIndex = tabs.indexOf(tab);
      if (targetIndex === -1) return;

      setActiveTab(tab);
      activeTabRef.current = tab;

      const container = containerRef.current;
      if (!container) return;

      const targetScrollLeft = targetIndex * container.clientWidth;

      if (Math.abs(container.scrollLeft - targetScrollLeft) > 1) {
        isProgrammaticScroll.current = true;

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 500);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    },
    [tabs]
  );

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    if (width <= 0) return;

    const rawIndex = container.scrollLeft / width;
    const targetIndex = Math.round(rawIndex);
    const newTab = tabs[targetIndex];

    if (newTab && newTab !== activeTabRef.current) {
      activeTabRef.current = newTab;
      setActiveTab(newTab);
    }
  }, [tabs]);

  const handleTouchStart = useCallback(() => {
    isProgrammaticScroll.current = false;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    containerRef,
    containerProps: {
      onScroll: handleScroll,
      onTouchStart: handleTouchStart,
    },
  };
}
