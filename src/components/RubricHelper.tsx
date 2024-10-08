import { useEffect } from "react";
import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { debounce } from "lodash";
import { userInputs, getVerbsByValue } from "@/constants/userInputs";
import { getRubricsByCriteria, getDefaultRubrics } from "@/constants/rubrics_new";
import { FormData } from "@/types/formdata";
import { RubricState } from "@/types/rubrics-types";
import { XIcon } from "lucide-react";

interface RubricHelperProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setRubricOptions: React.Dispatch<React.SetStateAction<RubricState[]>>;
    setRubricNames: React.Dispatch<React.SetStateAction<string[]>>;
    rubricOptions: RubricState[];
    setHelperOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RubricHelper({
    formData,
    setFormData,
    setRubricOptions,
    setRubricNames,
    setHelperOpen
}: RubricHelperProps) {

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Fetch rubrics based on form criteria
    useEffect(() => {
        const debouncedFetchRubrics = debounce(() => {
            if (formData.identity === "default") {
                const rubrics = getDefaultRubrics();
                setRubricOptions(rubrics);
                setRubricNames(rubrics.map((rubric) => rubric.name));
                setFormData((prevFormData) => ({ ...prevFormData, rubric: rubrics[0] }));
            }
            if (formData.identity && formData.identityLevel && formData.textType && formData.prose) {
                const rubrics = getRubricsByCriteria(formData.identity, formData.identityLevel, formData.textType, formData.prose);
                if (rubrics.length > 0) {
                    setRubricOptions(rubrics);
                    setRubricNames(rubrics.map((rubric) => rubric.name));
                    setFormData((prevFormData) => ({ ...prevFormData, rubric: rubrics[0] }));
                }
            }
        }, 300);
        debouncedFetchRubrics();
        return () => {
            debouncedFetchRubrics.cancel();
        };
    }, [formData.identity, formData.identityLevel, formData.textType, formData.prose, setFormData, setRubricNames, setRubricOptions]);

    // Update prose based on text type change
    useEffect(() => {
        if (formData.textType && userInputs.prose.details[formData.textType]) {
            const proseOptions = userInputs.prose.details[formData.textType]?.options || [];
            if (proseOptions.length > 0) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    prose: proseOptions[0]
                }));
            }
        }
    }, [formData.textType, setFormData]);

    return (
        <div className="flex flex-col flex-wrap items-left text-md space-y-2 border rounded-lg px-2 py-1">
            <div className="flex justify-end">
                <XIcon
                    className="cursor-pointer"
                    size={16}
                    onClick={() => setHelperOpen(false)}
                />
            </div>
            <div className="flex flex-wrap items-center mr-2">
                <span className="mr-2">I am a</span>
                <div className="flex flex-row gap-x-2">
                    {/* Identity Level */}
                    {formData.identity && formData.identity !== "default" && (
                        <CustomListbox
                            value={formData.identityLevel}
                            options={userInputs.identity.identityLevels[formData.identity].map(level => ({ label: level, value: level }))}
                            onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, identityLevel: value }))}
                            buttonClassName="w-fit"
                            placeholder="Select..."
                        />
                    )}
                    {/* Identity Selection */}
                    <CustomListbox
                        value={formData.identity}
                        options={userInputs.identity.options.map(identity => ({ label: identity, value: identity }))}
                        onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, identity: value }))}
                        buttonClassName="w-fit"
                        placeholder="Select..."
                    />
                </div>
                <span className="w-fit mr-2">.</span>

            </div>



            {/* My [assigner] has asked me to [text_type][verb] [topic] in a(n) [prose] for [audience]. */}
            {formData.identity && formData.identity !== "default" && (

                <div className="flex flex-wrap items-center gap-y-2">
                    <hr className="w-full border-t-2 border-gray-300" />
                    <div className="flex flex-row flex-wrap items-center">
                        <span className="w-fit mr-2">My</span>
                        <div className="w-fit mr-2">
                            <CustomListbox
                                value={formData.assigner}
                                options={userInputs.assigner.options[formData.identity]?.map(assigner => ({ label: assigner, value: assigner }))}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, assigner: value }))}
                                buttonClassName="w-[80px]"
                                placeholder="Select..."
                            />
                        </div>
                        <span className="w-fit mr-2">has asked </span>
                    </div>



                    <div className="flex flex-row flex-wrap items-center">
                        <span className="w-fit mr-2">me to</span>
                        <div className="w-fit mr-2">
                            <CustomListbox
                                value={(getVerbsByValue(formData.textType) || []).join(", ")}
                                options={userInputs.textType.map(textType => ({
                                    label: textType.verbs.join(", "),
                                    value: textType.value || ""
                                }))}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, textType: value }))}
                                buttonClassName="w-fit"
                                placeholder="Select..."
                            />
                        </div>
                    </div>

                    <Field className="flex items-center w-full">
                        <TextareaAutosize
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleInputChange}
                            minRows={1}
                            placeholder="Explain the topic"
                            className="border rounded w-full px-2 py-1"
                        />
                    </Field>

                    <span className="w-fit mx-2">in a(n)</span>

                    {formData.textType && userInputs.prose.details[formData.textType] && (
                        <div className="w-fit mr-2">
                            <CustomListbox
                                value={formData.prose}
                                options={userInputs.prose.details[formData.textType]?.options?.map(prose => ({ label: prose, value: prose }))}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, prose: value }))}
                                buttonClassName="w-fit"
                                placeholder="Select..."
                            />
                        </div>
                    )}

                    <span className="w-fit mr-2">for </span>
                    {formData.identity && userInputs.audience.contextBasedAudiences[formData.identity] && (
                        <div className="w-fit mr-2 flex">
                            <CustomListbox
                                value={formData.audience}
                                options={userInputs.audience.contextBasedAudiences[formData.identity]?.map(audience => ({ label: audience, value: audience }))}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, audience: value }))}
                                buttonClassName="w-fit"
                                placeholder="Select..."
                            />
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
