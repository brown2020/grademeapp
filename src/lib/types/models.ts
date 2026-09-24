export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

// Keep to mid/fast tiers: credits are charged at a flat per-token rate in
// generateResponse.ts, so premium models (e.g. GPT-6 Astra, Claude Opus) would
// cost more than users are billed. The first entry is the default model.
export const models: Model[] = [
  {
    id: 'gpt-6-sol',
    name: 'GPT-6 Sol',
    provider: 'OpenAI',
    providerId: 'openai'
  },
  {
    id: 'gpt-6-luna',
    name: 'GPT-6 Luna',
    provider: 'OpenAI',
    providerId: 'openai'
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    providerId: 'anthropic'
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    providerId: 'anthropic'
  },
  {
    id: 'gemini-pro-latest',
    name: 'Gemini Pro',
    provider: 'Google Generative AI',
    providerId: 'google'
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google Generative AI',
    providerId: 'google'
  },
  {
    id: 'grok-4.7',
    name: 'Grok 4.7',
    provider: 'XAI',
    providerId: 'xai'
  },
  {
    // Azure ids are deployment names; name the Azure deployment to match.
    id: 'gpt-6-sol',
    name: 'GPT-6 Sol',
    provider: 'Azure',
    providerId: 'azure'
  },
]
