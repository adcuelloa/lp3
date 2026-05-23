import { Heart, HeartHandshake, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Cat {
  id: number;
  name: string;
}

const PALETTES = [
  { bg: "#fde8d4", border: "#f0c4a0", emoji: "🐱" },
  { bg: "#e4f0e4", border: "#b8d8b8", emoji: "😸" },
  { bg: "#f4eae0", border: "#e4c8b0", emoji: "🐈" },
  { bg: "#e2ecf8", border: "#b8cce8", emoji: "😺" },
  { bg: "#f4e2ee", border: "#e8b8d4", emoji: "😻" },
  { bg: "#edf4e2", border: "#c8e0b0", emoji: "🐈‍⬛" },
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
  onAdopt: () => void;
  hasRequest?: boolean;
}

export default function CatCard({ cat, index, onEdit, onAdopt, hasRequest = false }: CatCardProps) {
  const palette = PALETTES[cat.id % PALETTES.length];
  const personality = PERSONALITIES[cat.id % PERSONALITIES.length];

  return (
    <Card
      className="gap-0 py-0 transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        animation: `fade-up 0.5s ease-out ${index * 65}ms both`,
      }}
    >
      <CardContent className="flex flex-col gap-4 p-6">
        {/* Top row: emoji + edit */}
        <div className="flex items-start justify-between">
          <span
            className="text-5xl leading-none select-none"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }}
          >
            {palette.emoji}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label={`Editar nombre de ${cat.name}`}
            className="text-muted-foreground"
          >
            <Pencil data-icon />
          </Button>
        </div>

        {/* Name + personality */}
        <div>
          <h3
            className="text-2xl font-semibold leading-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cat.name}
          </h3>
          <Badge variant="secondary" className="mt-2 text-xs uppercase tracking-widest">
            {personality}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {hasRequest ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-primary bg-primary/10">
            <HeartHandshake size={16} className="animate-heart-pop" />
            ¡Solicitud enviada!
          </div>
        ) : (
          <Button className="w-full rounded-xl" onClick={onAdopt}>
            <Heart data-icon="inline-start" />
            Adoptar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
