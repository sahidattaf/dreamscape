'use client';

import type { DesignNarrative as DesignNarrativeType } from '@/types/index';

interface DesignNarrativeProps {
  narrative: DesignNarrativeType;
}

export default function DesignNarrative({ narrative }: DesignNarrativeProps) {
  if (!narrative?.styleName) return null;

  return (
    <div className="bg-secondary border border-gold rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gold mb-6">{narrative.styleName}</h2>

      <div className="space-y-6">
        {narrative.designStory && (
          <div>
            <h3 className="text-lg font-semibold text-gold mb-2">Design Story</h3>
            <p className="text-gray-300 leading-relaxed">{narrative.designStory}</p>
          </div>
        )}

        {narrative.colorPalette?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gold mb-3">Color Palette</h3>
            <div className="flex flex-wrap gap-4">
              {narrative.colorPalette.map((color) => (
                <div key={color} className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-lg border border-gold/30 shadow"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs text-gray-400 mt-2 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {narrative.keyFurniture?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gold mb-2">Key Furniture</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {narrative.keyFurniture.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {narrative.lightingTextures && (
          <div>
            <h3 className="text-lg font-semibold text-gold mb-2">Lighting & Textures</h3>
            <p className="text-gray-300 leading-relaxed">{narrative.lightingTextures}</p>
          </div>
        )}
      </div>
    </div>
  );
}
