import { rubrics } from "@/constants/rubrics_new";
import { RubricState, NestedRubrics } from "@/types/rubrics-types";

// Recursive function to flatten the rubrics structure
export function flattenRubrics(): RubricState[] {
    const result: RubricState[] = [];

    function recursiveHelper(obj: NestedRubrics) {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            // Check if the value contains rubric properties
            if (value?.name && value?.description && value?.type && value?.criteria) {
                result.push(value as RubricState); // Push rubric object to the result array
            } else if (typeof value === "object") {
                // Recurse deeper if it's an object but not a rubric
                if (typeof value === "object" && value !== null && !("name" in value)) {
                    recursiveHelper(value as NestedRubrics);
                }
            }
        });
    }

    recursiveHelper(rubrics);
    return result;
}
