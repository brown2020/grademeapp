import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ fail: false, writes: [] as unknown[] }));
vi.mock("react-hot-toast", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/actions/deleteAccount", () => ({ deleteAccountData: vi.fn() }));
vi.mock("@/actions/profileActions", () => ({ ensureProfile: vi.fn() }));
vi.mock("@/firebase/loadFirestore", () => ({
  loadFirestore: async () => ({
    db: {},
    doc: (_db: unknown, path: string) => ({ path }),
    updateDoc: async (_ref: unknown, data: unknown) => {
      if (state.fail) throw new Error("permission-denied");
      state.writes.push(data);
    },
  }),
}));

const { useAuthStore } = await import("./useAuthStore");
const { default: useProfileStore } = await import("./useProfileStore");
const { toast } = await import("react-hot-toast");

beforeEach(() => {
  state.fail = false;
  state.writes = [];
  useAuthStore.setState({ uid: "alice" });
  useProfileStore.setState((s) => ({ profile: { ...s.profile, credits: 50, identity: "student", identityLevel: "9th grade" } }));
});

describe("useProfileStore.updateProfile", () => {
  it("writes only the changed fields and never credits", async () => {
    await useProfileStore.getState().updateProfile({ identity: "teacher", credits: 999 });
    expect(state.writes).toEqual([{ identity: "teacher" }]);
    expect(useProfileStore.getState().profile).toMatchObject({ identity: "teacher", credits: 50 });
  });

  it("rolls back the optimistic change and tells the user when the write fails", async () => {
    state.fail = true;
    const pending = useProfileStore.getState().updateProfile({ identity: "teacher" });
    expect(useProfileStore.getState().profile.identity).toBe("teacher");
    useProfileStore.getState().setCredits(40);
    await pending;
    expect(useProfileStore.getState().profile).toMatchObject({ identity: "student", identityLevel: "9th grade", credits: 40 });
    expect(toast.error).toHaveBeenCalled();
  });
});
