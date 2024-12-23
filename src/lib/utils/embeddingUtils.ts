// /lib/utils/embeddingUtils.ts

export async function getEmbeddingsForText(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key is missing.");

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ input: text, model: "text-embedding-ada-002" }),
  });

  if (!response.ok) throw new Error("Failed to fetch embeddings.");
  return (await response.json()).data[0].embedding;
}


export async function getEmbeddingForLargeText(text: string): Promise<number[]> {
  const chunkSize = 3000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(await getEmbeddingsForText(chunk));
  }

  const averaged = Array(chunks[0].length).fill(0);
  chunks.forEach((emb) => emb.forEach((val, i) => (averaged[i] += val)));
  return averaged.map((val) => val / chunks.length);
}


export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}
