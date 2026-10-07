/**
 * Test stand-in for `next/navigation` (aliased in cypress.config.ts).
 * The current path comes from a React context, so every test supplies its own
 * path via <PathnameProvider> and no state leaks between tests.
 */
import { createContext, useContext, type ReactNode } from "react";

const PathnameContext = createContext("/");

export function PathnameProvider({ value, children }: { value: string; children: ReactNode }) {
  return <PathnameContext.Provider value={value}>{children}</PathnameContext.Provider>;
}

export const usePathname = () => useContext(PathnameContext);
