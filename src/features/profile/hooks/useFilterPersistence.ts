import { useState, useCallback } from "react";
import type { FilterSearchParams } from "@/features/profile/api/profileApi";
import { INITIAL_FILTER_STATE } from "@/features/profile/utils/filterOptions";

const STORAGE_KEY = "iruyeon_home_filters";

function loadFiltersFromStorage(): FilterSearchParams {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FilterSearchParams;
    }
  } catch (e) {
    console.warn("Failed to load filters from sessionStorage:", e);
  }
  return INITIAL_FILTER_STATE;
}

function saveFiltersToStorage(filters: FilterSearchParams): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (e) {
    console.warn("Failed to save filters to sessionStorage:", e);
  }
}

export function useFilterPersistence() {
  const [filters, setFiltersState] = useState<FilterSearchParams>(() =>
    loadFiltersFromStorage()
  );

  // 필터 변경 시 스토리지에 저장
  const setFilters = useCallback((newFilters: FilterSearchParams) => {
    setFiltersState(newFilters);
    saveFiltersToStorage(newFilters);
  }, []);

  // 필터 초기화 (스토리지도 클리어)
  const resetFilters = useCallback(() => {
    setFiltersState(INITIAL_FILTER_STATE);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
