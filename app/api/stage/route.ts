import { NextRequest, NextResponse } from 'next/server';
import { updateProjectStatus, getProjectBySessionId } from '@/lib/supabase';
import { generateDesignNarrative } from '@/lib/openai';
import { stageRoom } from '@/lib/replicate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, photoUrl, style, buyerPersona, mustHaves, avoidances } = body;

    const project = await getProjectBySessionId(sessionId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await updateProjectStatus(project.id, {
      status: 'processing',
      processing_started_at: new Date().toISOString(),
    });

    const designNarrative = await generateDesignNarrative(
      style,
      buyerPersona,
      mustHaves,
      avoidances
    );

    const stagedImageUrl = await stageRoom(photoUrl, designNarrative.imageGenerationPrompt);

    await updateProjectStatus(project.id, {
      status: 'completed',
      staged_photo_url: stagedImageUrl,
      design_narrative: designNarrative,
      processing_completed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      stagedImageUrl,
      designNarrative,
    });
  } catch (error) {
    console.error('Staging error:', error);
    return NextResponse.json(
      {
        error: 'Failed to stage room',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
