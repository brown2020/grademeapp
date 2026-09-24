"use client";

import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RubricHelperTrigger({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Button onClick={onToggle} className="btn-shiny btn-shiny-yellow-orange">
      <LifeBuoy />
      <h2>Rubric Helper</h2>
    </Button>
  );
}
