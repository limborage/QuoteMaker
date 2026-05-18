import { useStore } from "zustand";
import { globalPlatformStore, type PlatformState } from "./globalPlatformStore";

export function usePlatformStore<T>(selector: (state: PlatformState) => T): T {
  return useStore(globalPlatformStore, selector);
}