"use client";

import { LifeBuoy } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";

export default function RubricHelperTrigger({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <CustomButton onClick={onToggle} className="btn-shiny btn-shiny-yellow-orange">
      <LifeBuoy />
      <h2>Rubric Helper</h2>
    </CustomButton>
  );
}
