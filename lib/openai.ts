import OpenAI from 'openai';
import type { DesignNarrative } from '@/types/index';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateDesignNarrative(
  style: string,
  buyerPersona: string = 'Modern professional',
  mustHaves: string = 'Natural light, minimalist aesthetic',
  avoidances: string = 'Clutter, bright colors'
): Promise<DesignNarrative> {
  const systemPrompt = `You are a luxury interior design consultant specializing in real estate staging.
Your task is to generate a compelling design narrative for a virtually staged room photo.

Return a JSON object with these exact fields:
- styleName: The design style name
- designStory: A 2-3 sentence engaging narrative about the design vision
- colorPalette: An array of 4-5 hex color codes used in the design
- keyFurniture: An array of 3-4 key furniture pieces included in the staging
- lightingTextures: A description of lighting and material textures (1-2 sentences)
- imageGenerationPrompt: A concise prompt under 100 words starting with "A photorealistic interior photograph" describing the staged room

Always return valid JSON, no markdown formatting.`;

  const userPrompt = `Design a ${style} staged room for the following brief:
- Target buyer persona: ${buyerPersona}
- Must-haves: ${mustHaves}
- Avoidances: ${avoidances}

Generate the design narrative and image prompt.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  const content = response.choices[0].message.content || '';

  try {
    const parsed = JSON.parse(content);
    return {
      styleName: parsed.styleName || 'Modern Design',
      designStory: parsed.designStory || '',
      colorPalette: parsed.colorPalette || [],
      keyFurniture: parsed.keyFurniture || [],
      lightingTextures: parsed.lightingTextures || '',
      imageGenerationPrompt: parsed.imageGenerationPrompt || '',
    };
  } catch {
    throw new Error('Failed to parse design narrative from OpenAI');
  }
}
