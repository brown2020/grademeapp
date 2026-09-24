import type { Metadata } from "next";
import { SupportContact } from "@/components/legal/SupportContact";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return <SupportContact />;
}
