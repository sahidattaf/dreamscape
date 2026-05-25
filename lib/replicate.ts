import Replicate from 'replicate';

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function stageRoom(
  inputImageUrl: string,
  imagePrompt: string
): Promise<string> {
  const negativePrompt = 'clutter, blurry, distorted, low quality, artifacts, cartoon, painting';

  const output = await replicate.run(
    'jagilley/controlnet-depth:922c7a8148027a3bf7c3c8e1c7ec3f8a8b9c2e0e6c5a9b9a8f0e1c5e3c1b5c7e' as `${string}/${string}:${string}`,
    {
      input: {
        image: inputImageUrl,
        prompt: imagePrompt,
        negative_prompt: negativePrompt,
        num_outputs: 1,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        controlnet_conditioning_scale: 1.0,
      },
    }
  );

  if (Array.isArray(output) && output.length > 0) {
    return output[0] as string;
  }

  throw new Error('No output from Replicate');
}
