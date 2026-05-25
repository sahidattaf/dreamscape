import Link from 'next/link';
import PricingCard from '@/components/PricingCard';
import UploadForm from '@/components/UploadForm';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { PricingTier } from '@/types/index';

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'quickstage',
    name: 'QuickStage',
    price: 150,
    description: 'Single room AI virtual staging',
    features: [
      'AI-powered room staging',
      'GPT-4o design narrative',
      'Before/after comparison',
      'Instant delivery',
    ],
    automated: true,
  },
  {
    id: 'dreamtour',
    name: 'DreamTour',
    price: 400,
    description: 'Multi-room property tour',
    features: [
      'Up to 5 rooms',
      'Professional walkthrough',
      'Design narratives',
      'Custom styling',
    ],
    automated: false,
  },
  {
    id: 'resort',
    name: 'Resort',
    price: 1200,
    description: 'Premium full property staging',
    features: [
      'Unlimited rooms',
      'Professional consultation',
      'Custom designs',
      'Priority support',
      'Renovation suggestions',
    ],
    automated: false,
  },
];

const FEATURES = [
  {
    title: 'Lightning Fast',
    description: 'Get staged photos in minutes, not weeks',
    icon: '⚡',
  },
  {
    title: 'Photorealistic',
    description: 'AI-powered staging looks like real furniture',
    icon: '🎨',
  },
  {
    title: 'Affordable',
    description: 'Starting at just $150 per room',
    icon: '💰',
  },
];

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-primary py-24 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gold mb-6">
          Transform Spaces. Sell Faster.
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          AI-powered virtual staging for real estate agents. Stage empty rooms in minutes, not
          days. Photorealistic results — no design skills needed.
        </p>
        <Link
          href={session ? '#upload' : '#pricing'}
          className="bg-gold text-primary px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition inline-block"
        >
          {session ? 'Stage a Room Now' : 'Get Started — $150'}
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-primary">
        <h2 className="text-4xl font-bold text-center text-gold mb-12">Why DreamScape?</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-secondary border border-gold/30 rounded-lg p-6 text-center hover:border-gold transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gold mb-2">{f.title}</h3>
              <p className="text-gray-300">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Form (authenticated) */}
      {session && (
        <section id="upload" className="py-20 bg-secondary">
          <UploadForm session={session} />
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-primary">
        <h2 className="text-4xl font-bold text-center text-gold mb-4">Simple Pricing</h2>
        <p className="text-center text-gray-400 mb-12">
          No subscriptions. Pay per project.
        </p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              {...tier}
              onSelect={
                tier.id === 'quickstage' && session
                  ? () => {
                      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary to-accent text-center px-4">
        <h2 className="text-3xl font-bold text-gold mb-4">Ready to Transform Properties?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Join thousands of real estate agents using DreamScape to sell faster.
        </p>
        {!session && (
          <Link
            href="#pricing"
            className="bg-gold text-primary px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition inline-block"
          >
            Start Today
          </Link>
        )}
        {session && (
          <Link
            href="#upload"
            className="bg-gold text-primary px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition inline-block"
          >
            Stage a Room
          </Link>
        )}
      </section>
    </div>
  );
}
