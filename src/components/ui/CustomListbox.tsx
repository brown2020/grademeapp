"use client";

import { SimpleSelect } from "./select";
import { Skeleton } from "./spinner";

/** @deprecated Temporary shim over SimpleSelect; migrate callers to SimpleSelect. */
export default function CustomListbox({
  value,
  options,
  onChange,
  buttonClassName,
  placeholder,
  isLoading = false,
  id,
}: {
  value: string | null | undefined;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  buttonClassName?: string;
  optionClassName?: string;
  optionsWrapperClassName?: string;
  placeholder?: string;
  isLoading?: boolean;
  id?: string;
}) {
  if (isLoading) return <Skeleton className="h-10 w-full" />;
  return (
    <SimpleSelect
      id={id}
      value={value}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      className={buttonClassName}
    />
  );
}
