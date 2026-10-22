import { create } from "zustand";
import type { Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { loadFirestore } from "@/firebase/loadFirestore";

export type PaymentType = {
  id: string;
  amount: number;
  createdAt: Timestamp | null;
  status: string;
  mode: string;
  platform: string;
  productId: string;
  currency: string;
};

/** Read-only mirror of users/{uid}/payments; payments are recorded by server actions. */
interface PaymentsStoreState {
  payments: PaymentType[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  fetchPayments: () => Promise<void>;
}

export const usePaymentsStore = create<PaymentsStoreState>((set) => ({
  payments: [],
  paymentsLoading: false,
  paymentsError: null,

  fetchPayments: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) {
      console.error("Invalid UID for fetchPayments");
      return;
    }

    set({ paymentsLoading: true });

    try {
      const payments = await fetchUserPayments(uid);
      set({ payments, paymentsLoading: false, paymentsError: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching payments";
      console.error("Error fetching payments", message);
      set({ paymentsError: message, paymentsLoading: false });
    }
  },
}));

async function fetchUserPayments(uid: string): Promise<PaymentType[]> {
  const { db, collection, getDocs, query } = await loadFirestore();
  const querySnapshot = await getDocs(query(collection(db, "users", uid, "payments")));
  const payments = querySnapshot.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      amount: data.amount,
      createdAt: data.createdAt,
      status: data.status,
      mode: data.mode,
      platform: data.platform,
      productId: data.productId,
      currency: data.currency,
    };
  });

  return payments.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
}
