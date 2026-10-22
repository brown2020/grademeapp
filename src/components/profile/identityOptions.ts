import { userInputs } from "@/lib/constants/userInputs";

export const DEFAULT_IDENTITY = "student";

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const toOptions = (values: string[]) =>
  values.map((value) => ({ label: capitalize(value), value }));

export const identityOptions = () => toOptions(userInputs.identity.options);

export const levelsFor = (identity: string | undefined) =>
  userInputs.identity.identityLevels[identity || DEFAULT_IDENTITY] ?? [];
