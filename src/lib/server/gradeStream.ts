const jobs = new Set<Promise<void>>();

/** Keeps in-flight credit reconciliation alive until the streamed grade finishes. */
export function trackSettlement(job: Promise<void>): void {
  jobs.add(job);
  void job.finally(() => jobs.delete(job));
}

/** Test hook so credit reconciliation can be observed after the action returns. */
export function waitForSettlements(): Promise<void> {
  return Promise.all([...jobs]).then(() => undefined);
}
