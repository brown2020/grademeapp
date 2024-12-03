import { experimental_createProviderRegistry as createProviderRegistry } from 'ai'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { createAzure } from '@ai-sdk/azure'
import { createOllama } from 'ollama-ai-provider'

export const registry = createProviderRegistry({
  openai,
  fireworks: createOpenAI({
    apiKey: process.env.FIREWORKS_API_KEY,
    baseURL: 'https://api.fireworks.ai/inference/v1',
  }),
  anthropic,
  google,
  groq: createOpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  }),
  ollama: createOllama({
    baseURL: `${process.env.OLLAMA_BASE_URL}/api`
  }),
  azure: createAzure({
    apiKey: process.env.AZURE_API_KEY,
    resourceName: process.env.AZURE_RESOURCE_NAME
  }),
  'openai-compatible': createOpenAI({
    apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
    baseURL: process.env.OPENAI_COMPATIBLE_API_BASE_URL
  })
})

export function getModel(model: string, userApiKey?: string) {
  const [provider, modelName] = model.split(':')

  console.log("Use user API key", userApiKey)
  console.log("Model", model)

  if (userApiKey) {
    switch (provider) {
      case 'openai':
        return createOpenAI({ apiKey: userApiKey })(modelName);
      case 'fireworks':
        return createOpenAI({
          apiKey: userApiKey,
          baseURL: 'https://api.fireworks.ai/inference/v1',
        })(modelName);
      default:
        throw new Error(`Provider ${provider} does not support user API keys`);
    }
  }

  return registry.languageModel(model)
}

export function isProviderEnabled(providerId: string): boolean {
  switch (providerId) {
    case 'openai':
      return !!process.env.OPENAI_API_KEY
    case 'fireworks':
      return !!process.env.FIREWORKS_API_KEY
    case 'anthropic':
      return !!process.env.ANTHROPIC_API_KEY
    case 'google':
      return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    case 'groq':
      return !!process.env.GROQ_API_KEY
    case 'ollama':
      return !!process.env.OLLAMA_BASE_URL
    case 'azure':
      return !!process.env.AZURE_API_KEY && !!process.env.AZURE_RESOURCE_NAME
    case 'openai-compatible':
      return (
        !!process.env.OPENAI_COMPATIBLE_API_KEY &&
        !!process.env.OPENAI_COMPATIBLE_API_BASE_URL &&
        !!process.env.NEXT_PUBLIC_OPENAI_COMPATIBLE_MODEL
      )
    default:
      return false
  }
}