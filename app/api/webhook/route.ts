import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency check
  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin.from('webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    data: event.data,
    processed_at: new Date().toISOString(),
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error || !project) {
      console.error('Project not found for session:', sessionId);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fire-and-forget background staging
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        photoUrl: project.original_photo_url,
        style: project.style,
        buyerPersona: project.buyer_persona,
        mustHaves: project.must_haves,
        avoidances: project.avoidances,
      }),
    }).catch((err) => console.error('Staging request failed:', err));
  }

  return NextResponse.json({ received: true });
}
