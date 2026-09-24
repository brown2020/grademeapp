"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SecretInput({ id, label, value, onChange, placeholder }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} htmlFor={id}>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="pr-11 font-mono"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </Field>
  );
}
