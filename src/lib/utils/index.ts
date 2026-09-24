import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Model } from '@/lib/types/models'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createModelId(model: Model): string {
  return `${model.providerId}:${model.id}`
}

export function getDefaultModelId(models: Model[]): string {
  if (!models.length) {
    throw new Error('No models available')
  }
  return createModelId(models[0])
}

/** Returns storedId if it is still offered, otherwise the default model id. */
export function resolveModelId(storedId: string | null | undefined, models: Model[]): string {
  if (storedId && models.some((m) => createModelId(m) === storedId)) return storedId
  return getDefaultModelId(models)
}
