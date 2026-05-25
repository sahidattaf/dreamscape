'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface UploadFormProps {
  session: Session | null;
}

const STYLES = [
  'Modern Minimalist',
  'Scandinavian',
  'Industrial Chic',
  'Classic Contemporary',
  'Luxury Modern',
];

export default function UploadForm({ session }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [style, setStyle] = useState(STYLES[0]);
  const [buyerPersona, setBuyerPersona] = useState('');
  const [mustHaves, setMustHaves] = useState('');
  const [avoidances, setAvoidances] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-gold/80', 'bg-accent/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-gold/80', 'bg-accent/20');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-gold/80', 'bg-accent/20');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileChange(files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError('Please select a photo');
    if (!session) return setError('Please log in first');

    setLoading(true);
    setError('');

    try {
      // Upload photo
      const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
      const photoUrl = urlData.publicUrl;

      // Create project record
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: session.user.id,
          original_photo_url: photoUrl,
          status: 'pending',
          style,
          buyer_persona: buyerPersona || null,
          must_haves: mustHaves || null,
          avoidances: avoidances || null,
          design_narrative: {},
        })
        .select()
        .single();
      if (projectError) throw projectError;

      // Create Stripe checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          userId: session.user.id,
          projectId: project.id,
        }),
      });
      const { sessionId, error: checkoutError } = await res.json();
      if (checkoutError) throw new Error(checkoutError);

      // Link session to project
      await supabase
        .from('projects')
        .update({ stripe_session_id: sessionId })
        .eq('id', project.id);

      // Redirect to Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gold mb-6">Stage Your Room</h2>

      {/* Photo Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gold rounded-lg p-8 text-center cursor-pointer transition bg-secondary mb-6"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
          id="photo-input"
        />
        <label htmlFor="photo-input" className="cursor-pointer block">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-cover mb-2" />
          ) : null}
          {file ? (
            <>
              <p className="text-gold">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">Click or drag to change</p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">📷</p>
              <p className="text-gray-300">Drag & drop your room photo here</p>
              <p className="text-sm text-gray-400 mt-1">or click to select • JPG, PNG, WEBP</p>
            </>
          )}
        </label>
      </div>

      {/* Style */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">Design Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full bg-secondary text-white border border-gold rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Buyer Persona */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">
          Buyer Persona <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={buyerPersona}
          onChange={(e) => setBuyerPersona(e.target.value)}
          placeholder="e.g., Young professional, Family with kids"
          className="w-full bg-secondary text-white border border-gold/50 rounded px-4 py-2 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Must-Haves */}
      <div className="mb-5">
        <label className="block text-white mb-2 font-semibold">
          Must-Haves <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={mustHaves}
          onChange={(e) => setMustHaves(e.target.value)}
          placeholder="e.g., Large sofa, natural light, fireplace"
          className="w-full bg-secondary text-white border border-gold/50 rounded px-4 py-2 h-20 focus:outline-none focus:border-gold resize-none"
        />
      </div>

      {/* Avoidances */}
      <div className="mb-6">
        <label className="block text-white mb-2 font-semibold">
          Avoidances <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={avoidances}
          onChange={(e) => setAvoidances(e.target.value)}
          placeholder="e.g., Bright colors, ornate furniture"
          className="w-full bg-secondary text-white border border-gold/50 rounded px-4 py-2 h-20 focus:outline-none focus:border-gold resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-gold text-primary font-bold py-3 rounded hover:opacity-90 disabled:opacity-50 transition text-lg"
      >
        {loading ? 'Processing...' : 'Proceed to Payment — $150'}
      </button>
    </form>
  );
}
