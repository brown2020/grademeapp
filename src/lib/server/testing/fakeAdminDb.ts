/**
 * Minimal in-memory stand-in for the firebase-admin Firestore surface used by the
 * server billing/payment code (doc get/update/set, equality queries, transactions).
 * Tests mock `firebase-admin/firestore` so `FieldValue.increment(n)` is `{ __increment: n }`.
 */
type Data = Record<string, unknown>;

interface DocRef {
  kind: "doc";
  path: string;
  get: () => Promise<Snapshot>;
  update: (data: Data) => Promise<void>;
  set: (data: Data, options?: { merge?: boolean }) => Promise<void>;
}

interface QueryRef {
  kind: "query";
  where: (field: string, op: "==", value: unknown) => QueryRef;
  limit: (count: number) => QueryRef;
  get: () => Promise<QuerySnap>;
}

interface Snapshot {
  exists: boolean;
  data: () => Data | undefined;
}

interface QuerySnap {
  empty: boolean;
  docs: { id: string; data: () => Data }[];
}

const isIncrement = (value: unknown): value is { __increment: number } =>
  typeof value === "object" && value !== null && "__increment" in value;

export function createFakeAdminDb(initial: Record<string, Data> = {}) {
  const docs = new Map<string, Data>(Object.entries(initial).map(([path, data]) => [path, { ...data }]));

  const write = (path: string, data: Data, merge: boolean) => {
    const next: Data = merge ? { ...(docs.get(path) ?? {}) } : {};
    for (const [key, value] of Object.entries(data)) {
      next[key] = isIncrement(value) ? Number(next[key] ?? 0) + value.__increment : value;
    }
    docs.set(path, next);
  };

  const snapshot = (path: string): Snapshot => ({
    exists: docs.has(path),
    data: () => (docs.has(path) ? { ...docs.get(path) } : undefined),
  });

  const doc = (path: string): DocRef => ({
    kind: "doc",
    path,
    get: async () => snapshot(path),
    update: async (data) => {
      if (!docs.has(path)) throw new Error(`NOT_FOUND: ${path}`);
      write(path, data, true);
    },
    set: async (data, options) => write(path, data, Boolean(options?.merge)),
  });

  const query = (collection: string, filters: [string, unknown][], max?: number): QueryRef => ({
    kind: "query",
    where: (field, _op, value) => query(collection, [...filters, [field, value]], max),
    limit: (count) => query(collection, filters, count),
    get: async () => {
      const matches = [...docs.entries()]
        .filter(([path]) => path.startsWith(`${collection}/`) && !path.slice(collection.length + 1).includes("/"))
        .filter(([, data]) => filters.every(([field, value]) => data[field] === value))
        .slice(0, max ?? Infinity);
      return {
        empty: matches.length === 0,
        docs: matches.map(([path, data]) => ({ id: path.split("/").pop() ?? path, data: () => ({ ...data }) })),
      };
    },
  });

  let autoId = 0;
  const collection = (path: string) =>
    Object.assign(query(path, []), {
      doc: (id: string) =>
        Object.assign(doc(`${path}/${id}`), {
          collection: (sub: string) => collection(`${path}/${id}/${sub}`),
        }),
      add: async (data: Data) => {
        const id = `auto${++autoId}`;
        docs.set(`${path}/${id}`, { ...data });
        return { id };
      },
    });

  return {
    docs,
    doc,
    collection,
    runTransaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      const writes: (() => Promise<void>)[] = [];
      const tx = {
        get: (ref: DocRef | QueryRef) => ref.get(),
        update: (ref: DocRef, data: Data) => void writes.push(() => ref.update(data)),
        set: (ref: DocRef, data: Data, options?: { merge?: boolean }) =>
          void writes.push(() => ref.set(data, options)),
      };
      const result = await fn(tx);
      for (const commit of writes) await commit();
      return result;
    },
  };
}

export type FakeAdminDb = ReturnType<typeof createFakeAdminDb>;
