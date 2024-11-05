import { useState, useEffect } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/react'
import { ChevronDown, CheckIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import clsx from 'clsx'

interface FontOption {
    label: string
    value: string
}

interface FontGroup {
    label: string
    options: FontOption[]
}

interface FontFamilyDropdownProps {
    editor: Editor
}

const FONT_FAMILY_GROUPS: FontGroup[] = [
    {
        label: 'Sans Serif',
        options: [
            { label: 'Inter', value: 'Inter' },
            { label: 'Arial', value: 'Arial' },
            { label: 'Helvetica', value: 'Helvetica' },
        ],
    },
    {
        label: 'Serif',
        options: [
            { label: 'Times New Roman', value: 'Times' },
            { label: 'Garamond', value: 'Garamond' },
            { label: 'Georgia', value: 'Georgia' },
        ],
    },
    {
        label: 'Monospace',
        options: [
            { label: 'Courier', value: 'Courier' },
            { label: 'Courier New', value: 'Courier New' },
        ],
    },
]

const FontFamilyDropdown: React.FC<FontFamilyDropdownProps> = ({ editor }) => {
    const [selectedFont, setSelectedFont] = useState<FontOption | null>(FONT_FAMILY_GROUPS[0].options[0]) // Default font family
    const [query, setQuery] = useState('')

    const filteredFonts = FONT_FAMILY_GROUPS.map((group) => ({
        ...group,
        options: group.options.filter((font) =>
            font.label.toLowerCase().includes(query.toLowerCase())
        ),
    })).filter((group) => group.options.length > 0)

    useEffect(() => {
        if (selectedFont) {
            editor.chain().focus().setFontFamily(selectedFont.value).run()
        }
    }, [selectedFont, editor])

    return (
        <div className="flex relative left-3 mr-2">
            <Combobox immediate value={selectedFont} onChange={setSelectedFont}
                onClose={() => setQuery('')}>
                <ComboboxInput
                    className={clsx(
                        'w-28 rounded-lg py-1.5 pr-6 pl-3 text-sm/6 bg-white/5 border border-white',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    aria-label="Font Family"
                    displayValue={(font: FontOption | null) => font?.label || ''}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Choose font"
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                </ComboboxButton>

                <ComboboxOptions
                    transition
                    anchor="bottom start"
                    className={clsx(
                        'bg-gray-200 w-fit rounded-lg p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}
                >
                    {filteredFonts.map((group) => (
                        <div key={group.label}>
                            <div className="text-xs font-semibold text-gray-600">
                                {group.label}
                            </div>
                            {group.options.map((font) => (
                                <ComboboxOption
                                    key={font.label}
                                    value={font}
                                    className=" text-primary-40 group flex cursor-default items-center rounded-lg py-1 px-1 gap-x-1 select-none data-[focus]:bg-white/10"
                                >
                                    <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                                    <div className="text-sm" style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </div>
                                </ComboboxOption>
                            ))}
                        </div>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
}

export default FontFamilyDropdown
