'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import type { Project } from '@/types/index';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const loadData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    setUser(session.user);

    const response = await fetch('/api/projects');
    const { projects: data } = await response.json();
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Poll for processing projects
    const interval = setInterval(() => {
      if (projects.some((p) => p.status === 'processing' || p.status === 'pending')) {
        loadData();
      }
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-gold text-6xl mb-4 animate-pulse">✦</div>
          <p className="text-gold text-xl">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-1">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <Link
            href="/#upload"
            className="bg-gold text-primary px-6 py-2 rounded font-bold hover:opacity-90 transition whitespace-nowrap"
          >
            + New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: projects.length },
            { label: 'Completed', value: projects.filter((p) => p.status === 'completed').length },
            { label: 'Processing', value: projects.filter((p) => p.status === 'processing' || p.status === 'pending').length },
            { label: 'Failed', value: projects.filter((p) => p.status === 'failed').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary border border-gold/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gold">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gold/30 rounded-lg">
            <p className="text-5xl mb-4">🏠</p>
            <p className="text-gray-400 text-lg mb-6">No projects yet. Stage your first room!</p>
            <Link
              href="/#upload"
              className="bg-gold text-primary px-8 py-3 rounded font-bold hover:opacity-90 transition inline-block"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
