export interface Project {
  id: string;
  user_id: string;
  original_photo_url: string;
  staged_photo_url: string | null;
  design_narrative: DesignNarrative;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  style: string;
  buyer_persona?: string;
  must_haves?: string;
  avoidances?: string;
  stripe_session_id: string;
  created_at: string;
  updated_at: string;
  processing_started_at?: string;
  processing_completed_at?: string;
}

export interface DesignNarrative {
  styleName: string;
  designStory: string;
  colorPalette: string[];
  keyFurniture: string[];
  lightingTextures: string;
  imageGenerationPrompt: string;
}

export interface StageRequest {
  photoUrl: string;
  style: string;
  buyerPersona?: string;
  mustHaves?: string;
  avoidances?: string;
  projectId: string;
  userId: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  automated: boolean;
}
