import { rubrics } from "@/constants/rubrics_new";
import { RubricState } from "@/types/rubrics-types";

// Recursive function to flatten the rubrics structure
export function flattenRubrics(rubrics: any): RubricState[] {
    const result: RubricState[] = [];

    function recursiveHelper(obj: any) {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            // Check if the value contains rubric properties
            if (value?.name && value?.description && value?.type && value?.criteria) {
                result.push(value as RubricState); // Push rubric object to the result array
            } else if (typeof value === "object") {
                // Recurse deeper if it's an object but not a rubric
                recursiveHelper(value);
            }
        });
    }

    recursiveHelper(rubrics);
    return result;
}
