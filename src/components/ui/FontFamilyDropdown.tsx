import { useState, useEffect } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/react'
import { ChevronDown, CheckIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import clsx from 'clsx'

interface FontFamily {
    id: number
    name: string
    fontFamily: string
}

interface FontFamilyDropdownProps {
    editor: Editor
}

const fontFamilies: FontFamily[] = [
    { id: 1, name: 'Inter', fontFamily: 'Inter' },
    { id: 2, name: 'Comic Sans', fontFamily: 'Comic Sans MS, Comic Sans' },
    { id: 3, name: 'Serif', fontFamily: 'serif' },
    { id: 4, name: 'Monospace', fontFamily: 'monospace' },
    { id: 5, name: 'Cursive', fontFamily: 'cursive' },
    { id: 6, name: 'CSS Variable', fontFamily: 'var(--title-font-family)' },
]

const FontFamilyDropdown: React.FC<FontFamilyDropdownProps> = ({ editor }) => {
    const [selectedFont, setSelectedFont] = useState<FontFamily | null>(fontFamilies[0]) // Default font family
    const [query, setQuery] = useState('')

    const filteredFonts =
        query === ''
            ? fontFamilies
            : fontFamilies.filter((font) =>
                font.name.toLowerCase().includes(query.toLowerCase())
            )

    // const handleFontChange = (font: FontFamily) => {
    //     if (font) {
    //         setSelectedFont(font)
    //         editor.chain().focus().setFontFamily(font.fontFamily).run()
    //     }
    // }

    useEffect(() => {
        if (selectedFont) {
            editor.chain().focus().setFontFamily(selectedFont.fontFamily).run()
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
                    displayValue={(font: FontFamily | null) => font?.name || ''}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Choose font"
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                </ComboboxButton>

                <ComboboxOptions
                    transition
                    anchor="bottom"
                    className={clsx(
                        'bg-gray-300 w-[var(--input-width)] rounded-lg p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}
                >
                    {filteredFonts.map((font) => (
                        <ComboboxOption
                            key={font.id}
                            value={font}
                            className=" text-primary group flex cursor-default items-center gap-1 rounded-lg py-1.5 px-1 select-none data-[focus]:bg-white/10"
                        >
                            <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                            <div className="text-sm/6" style={{ fontFamily: font.fontFamily }}>
                                {font.name}
                            </div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
}

export default FontFamilyDropdown
