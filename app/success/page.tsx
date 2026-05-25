'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BeforeAfter from '@/components/BeforeAfter';
import DesignNarrative from '@/components/DesignNarrative';
import Link from 'next/link';
import type { Project } from '@/types/index';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects?sessionId=${sessionId}`);
        const { projects } = await response.json();
        if (projects && projects.length > 0) {
          setProject(projects[0]);
          if (projects[0].status === 'completed' || projects[0].status === 'failed') {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch {
        setError('Failed to load project');
        setLoading(false);
      }
    };

    fetchProject();
    const interval = setInterval(fetchProject, 4000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">✦</div>
          <p className="text-gold text-2xl mb-2">Payment confirmed!</p>
          <p className="text-gray-400">Setting up your project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-2xl mb-6">{error}</p>
          <Link href="/" className="bg-gold text-primary px-6 py-2 rounded font-bold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gold mb-3">Payment Successful!</h1>
          <p className="text-gray-300">
            {project?.status === 'completed'
              ? 'Your room has been staged. Here are the results!'
              : 'Your room is being staged. This takes 1–3 minutes.'}
          </p>
        </div>

        {/* Processing state */}
        {project && (project.status === 'processing' || project.status === 'pending') && (
          <div className="bg-accent border border-gold rounded-lg p-8 mb-10 text-center">
            <div className="text-4xl mb-3 animate-pulse">🏗️</div>
            <p className="text-gold text-lg mb-2">AI is staging your room...</p>
            <p className="text-gray-400 text-sm">
              GPT-4o is crafting your design narrative and Replicate is generating
              the staged image. We&apos;ll auto-refresh when it&apos;s ready.
            </p>
            <div className="mt-4 w-full bg-secondary rounded-full h-2">
              <div className="bg-gold h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Completed state */}
        {project?.status === 'completed' && project.staged_photo_url && (
          <div className="space-y-10">
            <div className="bg-secondary border border-gold rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gold mb-6 text-center">Before & After</h2>
              <div className="flex justify-center">
                <BeforeAfter
                  before={project.original_photo_url}
                  after={project.staged_photo_url}
                />
              </div>
            </div>

            {project.design_narrative?.styleName && (
              <DesignNarrative narrative={project.design_narrative} />
            )}
          </div>
        )}

        {/* Failed state */}
        {project?.status === 'failed' && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 text-center mb-10">
            <p className="text-red-400 text-xl mb-2">Processing failed</p>
            <p className="text-gray-400 mb-6">
              Something went wrong during AI staging. Please contact support — we&apos;ll refund your payment.
            </p>
            <Link href="/" className="bg-gold text-primary px-6 py-2 rounded font-bold">
              Try Again
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/dashboard"
            className="bg-gold text-primary px-8 py-3 rounded font-bold hover:opacity-90 transition text-center"
          >
            View All Projects
          </Link>
          <Link
            href="/"
            className="border border-gold text-gold px-8 py-3 rounded font-bold hover:bg-gold hover:text-primary transition text-center"
          >
            Stage Another Room
          </Link>
        </div>
      </div>
    </div>
  );
}
