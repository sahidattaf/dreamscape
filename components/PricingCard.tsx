'use client';

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  automated: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  automated,
  onSelect,
}: PricingCardProps) {
  return (
    <div className="bg-secondary border border-gold rounded-lg p-8 hover:shadow-lg hover:shadow-gold/20 transition flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-bold text-gold">{name}</h3>
        {automated && (
          <span className="text-xs bg-gold text-primary px-2 py-1 rounded font-semibold">
            Automated
          </span>
        )}
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <p className="text-3xl font-bold text-white mb-6">
        ${price}
        <span className="text-sm text-gray-400 font-normal">/project</span>
      </p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
            <span className="text-gold font-bold">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {onSelect ? (
        <button
          onClick={onSelect}
          className="w-full bg-gold text-primary font-bold py-2 rounded hover:opacity-90 transition mt-auto"
        >
          Get Started
        </button>
      ) : (
        <button
          disabled
          className="w-full bg-accent text-gray-400 font-bold py-2 rounded mt-auto cursor-not-allowed"
        >
          Contact Us
        </button>
      )}
    </div>
  );
}
