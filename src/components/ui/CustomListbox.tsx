"use client"

import { forwardRef } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton'; // Skeleton loader


// General Type for Listbox Option
interface ListboxOptionType {
  label: string;
  value: string;
}

// Props for the CustomListbox component
interface CustomListboxProps<T> {
  value: T;
  options: ListboxOptionType[];
  onChange: (value: T) => void;
  buttonClassName?: string;
  optionClassName?: string;
  optionsWrapperClassName?: string;
  placeholder?: string;
  isLoading?: boolean;
}

const CustomListbox = <T extends string | number | string[] | null>({
  value,
  options,
  onChange,
  buttonClassName,
  optionClassName,
  optionsWrapperClassName,
  placeholder = "Select an option",
  isLoading = false,
}: CustomListboxProps<T>) => {

  const MyCustomButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    return <button className="..." ref={ref} {...props} />;
  });
  MyCustomButton.displayName = "MyCustomButton";

  const MyCustomDiv = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    return <div className="..." ref={ref} {...props} />;
  });
  MyCustomDiv.displayName = "MyCustomDiv";

  if (isLoading) {
    // Show Skeleton Loader when loading
    return (
      <div className="w-full">
        <Skeleton height={40} />
      </div>
    );
  }

  if (!options || options.length === 0) {
    return <div>No options available</div>;
  }

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <ListboxButton
            as={MyCustomButton}
            className={clsx(
              "align-bottom pt-2 rounded-md text-sm ring-0 data-[focus]:ring-0 focus:outline-none data-[focus]:bg-secondary",
              buttonClassName
            )}
          >
            <div className="relative w-fit min-w-[50px]">
              <div className="flex items-center px-2 w-fit">
                <div className="w-fit">{value || placeholder}</div>
                <ChevronDown
                  className={clsx(
                    "size-4 ml-1 duration-300 transform",
                    open ? " -rotate-180" : "-rotate-0"
                  )}
                />
              </div>
              <hr />
            </div>
          </ListboxButton>
          <ListboxOptions anchor="bottom" className={clsx("rounded-md cursor-pointer z-10", "custom-listbox-options", optionsWrapperClassName)}>
            {options.map(({ label, value }, index) => (
              <ListboxOption
                key={index}
                value={value}
                as={MyCustomDiv}
                // Apply alternating background color based on even/odd index
                className={clsx(
                  "group flex gap-2 px-2 py-1 data-[focus]:bg-secondary-50 text-sm",
                  index % 2 === 0 ? "bg-secondary-97" : "bg-secondary-93", // Alternating background colors
                  optionClassName
                )}
              >
                {label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
};

export default CustomListbox;
