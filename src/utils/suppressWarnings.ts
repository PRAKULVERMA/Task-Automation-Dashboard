// Global warning suppression for known library issues
let originalConsoleWarn: typeof console.warn;

export const suppressRechartsWarnings = () => {
  if (originalConsoleWarn) {
    return; // Already suppressed
  }

  originalConsoleWarn = console.warn;

  console.warn = (...args) => {
    // Suppress Recharts defaultProps warnings
    if (
      typeof args[0] === "string" &&
      args[0].includes("Support for defaultProps will be removed") &&
      (args[0].includes("XAxis") ||
        args[0].includes("YAxis") ||
        args[0].includes("recharts"))
    ) {
      return; // Suppress this warning
    }

    // Allow all other warnings through
    originalConsoleWarn.apply(console, args);
  };
};

export const restoreConsoleWarn = () => {
  if (originalConsoleWarn) {
    console.warn = originalConsoleWarn;
    originalConsoleWarn = null as any;
  }
};

// Auto-suppress on import (for development)
if (typeof window !== "undefined") {
  suppressRechartsWarnings();
}
