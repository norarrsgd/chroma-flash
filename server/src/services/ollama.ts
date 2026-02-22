const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'qwen3:1.7b';

export async function generateText(wordCount: number): Promise<string[]> {
  const prompt = `Write a coherent, engaging message using exactly ${wordCount} words. Use everyday English words. Do not use markdown or special formatting. Do not include any thinking or reasoning tags.`;

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { response?: string };
  const text: string = data.response || '';

  // Remove thinking tags and their content if present
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Strip punctuation and split into clean words
  const words = cleaned
    .split(/\s+/)
    .map((w: string) => w.replace(/[^a-zA-Z0-9'-]/g, ''))
    .filter((w: string) => w.length > 0);

  return words;
}
