"use client"

import { forwardRef } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import clsx from 'clsx';

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
    placeholder?: string; // For displaying placeholder text when no value is selected
}

const CustomListbox = <T extends string | number | string[] | null>({
    value,
    options,
    onChange,
    buttonClassName,
    optionClassName,
    optionsWrapperClassName,
    placeholder = "Select an option",
}: CustomListboxProps<T>) => {

    const MyCustomButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
        return <button className="..." ref={ref} {...props} />;
    });
    MyCustomButton.displayName = "MyCustomButton";

    const MyCustomDiv = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
        return <div className="..." ref={ref} {...props} />;
    });
    MyCustomDiv.displayName = "MyCustomDiv";

    return (
        <Listbox value={value} onChange={onChange}>
            <ListboxButton
                as={MyCustomButton}
                className={clsx(
                    "flex justify-center items-center px-2 py-1 bg-orange-400 rounded-md text-sm",
                    buttonClassName
                )}
            >
                {value || placeholder}
            </ListboxButton>
            <ListboxOptions anchor="bottom" className={clsx("rounded-md cursor-pointer", optionsWrapperClassName)}>
                {options.map(({ label, value }, index) => (
                    <ListboxOption
                        key={index}
                        value={value}
                        as={MyCustomDiv}
                        // Apply alternating background color based on even/odd index
                        className={clsx(
                            "group flex gap-2 px-2 py-1 data-[focus]:bg-orange-200 text-sm",
                            index % 2 === 0 ? "bg-gray-200" : "bg-gray-100", // Alternating background colors
                            optionClassName
                        )}
                    >
                        {label}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
};

export default CustomListbox;
