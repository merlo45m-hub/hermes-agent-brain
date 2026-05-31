/**
 * AI prompt templates for API-first features (Phase 2).
 *
 * Used with OpenRouter / Replicate for object removal, style transfer,
 * and any feature that calls an external LLM or diffusion model.
 */

export const PROMPTS = {
  // Object removal: inpainting prompt
  inpainting: {
    system: `You are an image inpainting assistant. Given a photo and a mask region, 
fill the masked area with contextually appropriate content. The result should look 
natural and seamless.`,

    user: (description: string) =>
      `Remove the object described as: "${description}". 
Fill the area with what would naturally be behind it. Do not leave artifacts.`,
  },

  // Style transfer: applies a style reference
  styleTransfer: {
    user: (style: string) =>
      `Apply the following artistic style to this photo: "${style}". 
Preserve the original composition and subject, only change the visual style.`,
  },

  // Prompt enhancement: improve a user's edit prompt
  enhance: {
    system: `You are a photography enhancement assistant. Given a photo description 
and desired adjustments, produce a detailed processing recipe.`,

    user: (goal: string) =>
      `The user wants: "${goal}". Suggest specific adjustments 
(exposure, contrast, saturation, etc.) with numeric values to achieve this look.`,
  },

  // Auto-tagging fallback (if ONNX model unavailable)
  autoTag: {
    system: `You are a photo categorization assistant. Given a description of a photo, 
return appropriate tags and a primary category.`,

    user: (description: string) =>
      `Categorize this photo: "${description}". Return JSON with "tags" (array) 
and "primaryCategory" (string, one of: portrait, landscape, macro, event, street, food, 
architecture, wildlife, abstract).`,
  },
};
