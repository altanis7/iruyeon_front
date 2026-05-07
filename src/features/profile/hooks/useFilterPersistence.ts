import { useState, useCallback, useEffect } from "react";
import type { NavigationType } from "react-router";
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

export function useFilterPersistence(navigationType: NavigationType) {
  // navigationType이 "POP" (뒤로가기)일 때만 sessionStorage에서 복원
  // "PUSH" 또는 "REPLACE" (새로운 네비게이션)일 때는 초기 상태 사용
  const [filters, setFiltersState] = useState<FilterSearchParams>(() => {
    if (navigationType === "POP") {
      return loadFiltersFromStorage();
    }
    return INITIAL_FILTER_STATE;
  });

  // 새로운 네비게이션(PUSH/REPLACE) 발생 시 필터 초기화
  useEffect(() => {
    if (navigationType !== "POP") {
      setFiltersState(INITIAL_FILTER_STATE);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [navigationType]);

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
