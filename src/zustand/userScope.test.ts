import { describe, expect, it, vi } from "vitest";

vi.mock("@/firebase/loadFirestore", () => ({ loadFirestore: vi.fn() }));
vi.mock("@/actions/deleteAccount", () => ({ deleteAccountData: vi.fn() }));
vi.mock("@/actions/profileActions", () => ({ ensureProfile: vi.fn() }));

const { resetUserScopedStores } = await import("./userScope");
const { default: useProfileStore } = await import("./useProfileStore");
const { usePaymentsStore } = await import("./usePaymentsStore");
const { useRubricStore } = await import("./useRubricStore");

describe("resetUserScopedStores", () => {
  it("clears every user-scoped store so the next account starts clean", () => {
    useProfileStore.setState((s) => ({ profile: { ...s.profile, credits: 42, openai_api_key: "sk-a", identity: "teacher" } }));
    usePaymentsStore.setState({ payments: [{ id: "pi_1" } as never], paymentsError: "x" });
    useRubricStore.getState().setGradingData({ text: "Alice's private draft", title: "Mine" });
    useRubricStore.setState({ customRubrics: [{ id: "c1" } as never], customRubricsUid: "alice" });

    resetUserScopedStores();

    expect(useProfileStore.getState().profile).toMatchObject({ credits: 0, openai_api_key: "", identity: "" });
    expect(usePaymentsStore.getState()).toMatchObject({ payments: [], paymentsError: null });
    expect(useRubricStore.getState().gradingData).toMatchObject({ text: "", title: "" });
    expect(useRubricStore.getState()).toMatchObject({ customRubrics: [], customRubricsUid: null, rubricChosenByUser: false });
    expect(useRubricStore.getState().rubricOptions.every((r) => !r.isCustom)).toBe(true);
  });
});
