import { Heart, HeartHandshake, Pencil } from "lucide-react";
import { useState } from "react";

interface Cat {
  id: number;
  name: string;
}

const PALETTES = [
  { bg: "#FDE8D4", border: "#F0C4A0", emoji: "🐱" },
  { bg: "#E4F0E4", border: "#B8D8B8", emoji: "😸" },
  { bg: "#F4EAE0", border: "#E4C8B0", emoji: "🐈" },
  { bg: "#E2ECF8", border: "#B8CCE8", emoji: "😺" },
  { bg: "#F4E2EE", border: "#E8B8D4", emoji: "😻" },
  { bg: "#EDF4E2", border: "#C8E0B0", emoji: "🐈‍⬛" },
];

const PERSONALITIES = [
  "Aventurero",
  "Muy cariñoso",
  "Juguetón",
  "Tranquilo",
  "Curioso",
  "Independiente",
  "Sociable",
  "Misterioso",
];

interface CatCardProps {
  cat: Cat;
  index: number;
  onEdit: () => void;
}

export default function CatCard({ cat, index, onEdit }: CatCardProps) {
  const [adopted, setAdopted] = useState(false);
  const palette = PALETTES[cat.id % PALETTES.length];
  const personality = PERSONALITIES[cat.id % PERSONALITIES.length];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: palette.bg,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 2px 16px rgba(26, 15, 7, 0.06), 0 1px 3px rgba(26, 15, 7, 0.04)",
        animation: `fade-up 0.5s ease-out ${index * 65}ms both`,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span
          className="text-5xl leading-none select-none"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }}
        >
          {palette.emoji}
        </span>
        <button
          onClick={onEdit}
          className="p-2 rounded-xl transition-all hover:opacity-60 active:scale-95"
          style={{ color: "var(--color-muted)" }}
          aria-label={`Editar nombre de ${cat.name}`}
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3
          className="text-2xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-espresso)" }}
        >
          {cat.name}
        </h3>
        <p
          className="text-xs mt-1.5 uppercase tracking-widest font-semibold"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}
        >
          {personality}
        </p>
      </div>

      {/* Adopt button */}
      {adopted ? (
        <div
          className="flex items-center gap-2 justify-center py-3 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: "rgba(212, 120, 62, 0.12)",
            color: "var(--color-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          <HeartHandshake size={16} className="animate-heart-pop" />
          ¡Solicitud enviada!
        </div>
      ) : (
        <button
          onClick={() => setAdopted(true)}
          className="flex items-center gap-2 justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
            fontFamily: "var(--font-body)",
          }}
        >
          <Heart size={15} />
          Adoptar
        </button>
      )}
    </div>
  );
}
