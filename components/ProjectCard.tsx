'use client';

import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types/index';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-secondary border border-gold rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gold/20 transition">
      <div className="relative w-full h-48 bg-primary">
        {project.original_photo_url ? (
          <Image
            src={project.original_photo_url}
            alt="Original room"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gold">{project.style}</h3>
          <span
            className={`${getStatusColor(project.status)} text-white text-xs px-2 py-1 rounded capitalize`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{formatDate(project.created_at)}</p>
        {project.staged_photo_url && (
          <a
            href={project.staged_photo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline text-sm"
          >
            View Staged Photo →
          </a>
        )}
        {project.status === 'processing' && (
          <p className="text-yellow-400 text-sm animate-pulse">Processing...</p>
        )}
        {project.status === 'failed' && (
          <p className="text-red-400 text-sm">Processing failed</p>
        )}
      </div>
    </div>
  );
}
