/**
 * Stores holding one user's data register a reset here when their module
 * loads, so sign-out and account switches clear them without the shell
 * importing (and bundling) every store.
 */
const resets = new Set<() => void>();

export function onUserReset(reset: () => void) {
  resets.add(reset);
}

export function resetUserScopedStores() {
  for (const reset of resets) reset();
}
