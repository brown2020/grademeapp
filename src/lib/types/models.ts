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
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    providerId: 'anthropic'
  },
  {
    id: 'grok-4.7',
    name: 'Grok 4.7',
    provider: 'XAI',
    providerId: 'xai'
  },
]
